---
slug: mihomo-tun-cidr-route-exclude-fake-ip-direct
title: "從 CIDR 到 TUN：IPv4 前綴、主機路由與 Mihomo 流量控制的工程解析"
description: "從 32-bit IPv4、CIDR 前綴與最長前綴匹配出發，拆解 /32 主機路由如何經由 TUN、DNS Fake-IP 與 Mihomo 規則控制一條連線的實際流向。"
authors: [tianrking]
tags: [網路, 路由, CIDR, TUN, Mihomo, Clash Verge, DNS]
date: 2026-08-26
keywords: [IPv4, CIDR, /32, 主機路由, 最長前綴匹配, FIB, TUN, Mihomo, Fake-IP, DNS, DIRECT, route-exclude-address]
---

**103.143.81.55/32** 看起來只是一行設定，背後卻跨了 IPv4 位址語義、核心路由表、TUN 攔截、DNS 回覆與代理出站五個層次。若目標是「讓它直連」，先要釐清直連究竟是**完全不進 TUN**，還是**進入 Mihomo 後選擇 DIRECT 出站**。

最短的結論如下：

- **103.143.81.55/32** 是只匹配這一個 IPv4 位址的 CIDR 主機前綴。
- 把它寫進 **tun.route-exclude-address**，控制的是作業系統把流量導入 TUN 之前的路徑。
- 把它寫成 **IP-CIDR,103.143.81.55/32,DIRECT**，控制的是封包已進入 Mihomo 後的出站選擇。
- 若應用程式使用網域而且開啟 Fake-IP，作業系統可能看到的是虛擬 IP；單排除真實 IP 就不會命中。
- 若真正意圖是「某個服務名稱直連」，通常應先使用 **DOMAIN,名稱,DIRECT**，而不是永久鎖死一個可能變動的 A 記錄。

本文先講 IP 規範與選路模型，再把 Mihomo 放回它實際所在的資料面。Mihomo 章節以官方設定文件所公開的行為為準；不同核心版本、作業系統、權限、TUN stack 與網路環境可能使用不同後端，實際結果必須由本機路由表、連線日誌與封包觀測證明。

:::note[例子範圍]

103.143.81.55 與 hk2.w0x7ce.eu 僅用來說明 CIDR、規則與驗證方法，不表示目前 DNS、伺服器可達性、所有權、白名單或任何安全策略。請使用自己被授權管理的目標驗證。

:::

## 1. 一條連線其實經過四個控制面

以瀏覽器開啟某個 HTTPS 網域為例，至少有四個獨立的決策面。把它們分開，是理解所有 TUN 規則的前提。

| 控制面 | 主要決策者 | 看得到什麼 | 它能改變什麼 | 它不能保證什麼 |
| --- | --- | --- | --- | --- |
| DNS / 名稱解析 | resolver、Fake-IP 映射 | FQDN、DNS policy | 回覆真實或虛擬位址 | 封包最後從哪張網卡出去 |
| 本機選路 | OS policy routing、FIB | 目的 IP、介面、metric、路由表 | 送往實體介面或 TUN | Mihomo 最後選了哪個 proxy |
| 代理核心 | Mihomo rules / outbound | hostname、目的 IP、程序、介面等 | DIRECT、代理群組、拒絕 | 遠端服務是否接受請求 |
| 遠端安全邊界 | firewall、TLS、應用程式 | 來源、SNI、憑證、帳號、token | 放行、拒絕、授權 | 用戶端有沒有先進 TUN |

因此「直連」有兩種不同含義：

1. **路由層直連**：封包於 OS FIB 階段直接走原本的 Wi-Fi、乙太網或行動網路，不進 TUN。
2. **代理核心直連**：封包先由 TUN 交給 Mihomo，Mihomo 比對規則後以 DIRECT 建立外連，不經代理節點。

第一種適合避免循環路由、排除 LAN 或特定目的 IP；第二種適合保留規則可觀測性與名稱分類，同時避免某服務走代理。它們不是同一件事，也不能互相替代。

## 2. IPv4 與 CIDR：斜線後的數字是前綴長度

IPv4 是固定 32 bit 的位址，只是為了閱讀而以四個十進位 octet 顯示。CIDR 的核心是明確指定「前面多少個 bit 用於比對」。IETF 的 [RFC 4632](https://www.rfc-editor.org/rfc/rfc4632.html) 將表示法定義為 a.b.c.d/p，其中 p 可由 0 到 32。

以 103.143.81.55 為例：

```text
103        . 143        . 81         . 55
01100111   . 10001111   . 01010001   . 00110111
```

在 103.143.81.55/32 裡，所有 32 個 bit 都是前綴：

```text
前綴 bit： 01100111.10001111.01010001.00110111
host bit： （沒有剩餘 bit）
遮罩：     255.255.255.255
位址數：   2^(32 - 32) = 1
```

因此它是**主機路由**：在路由查詢中只會命中這一個 IPv4 值。RFC 4632 的前綴表明確列出 /32 是 one-address host route，/0 是涵蓋所有 IPv4 的 default route。

### 2.1 位址數不是「可配主機數」

CIDR 前綴所包含的位址數公式為：

```text
位址數 = 2^(32 - prefix_length)
```

| 前綴 | 十進位遮罩 | 前綴內位址數 | 常見路由含義 |
| --- | --- | ---: | --- |
| 0.0.0.0/0 | 0.0.0.0 | 4,294,967,296 | default route |
| 10.0.0.0/8 | 255.0.0.0 | 16,777,216 | 大型彙總 |
| 172.16.0.0/16 | 255.255.0.0 | 65,536 | 一般彙總或私網 |
| 192.168.99.0/24 | 255.255.255.0 | 256 | 常見 LAN 前綴 |
| 103.143.81.55/32 | 255.255.255.255 | 1 | 單一目的地 |

「/24 等於 254 台主機」只是在典型乙太網 IPv4 子網中，扣除網路與廣播位址後的常見教學結論；它不是 CIDR 的位址數定義。CIDR 是一個位址集合與前綴匹配語言。對 /31 point-to-point、loopback、主機路由與非乙太網鏈路，直接套用 N - 2 的說法會失真。

### 2.2 為什麼 103.143.81.55/24 代表 103.143.81.0/24

當前綴短於 /32，host bit 不屬於網路識別。例如：

```text
103.143.81.55/24
→ 匹配集合：103.143.81.0 至 103.143.81.255
→ 正規化前綴：103.143.81.0/24
```

有些工具會接受帶 host bit 的寫法並自動正規化，有些會拒絕。跨平台設定中應直接寫前綴邊界，避免人與工具對「這段網段」有不同理解。/32 沒有 host bit，因此 103.143.81.55/32 本身已是正規形式。

## 3. FIB 選路：最長前綴匹配優先於更大的彙總

FIB 是核心用來決定封包下一跳或介面的轉送表。對典型 unicast 查詢，所有能匹配目的位址的前綴會競爭，**匹配 bit 最多的前綴優先**。這叫 longest-prefix match，亦是 CIDR 能以更細前綴覆蓋大範圍 aggregate 的基礎。

假設存在以下路由：

```text
0.0.0.0/0          → Wi-Fi gateway
103.143.0.0/16     → TUN
103.143.81.0/24    → TUN
103.143.81.55/32   → Wi-Fi gateway
```

對目的 103.143.81.55：

```text
0.0.0.0/0           匹配
103.143.0.0/16      匹配
103.143.81.0/24     匹配
103.143.81.55/32    匹配  ← 前綴最長，最具體
```

所以 /32 覆蓋 /24、/16 與 /0；對 103.143.81.99，則是 /24 覆蓋 /16 與 /0。

不過，這不是「加一條 /32 就必定生效」的萬用公式：

- 前綴長度相同時，才可能由 route metric、行政距離或平台實作決定。
- policy routing、多張路由表、VPN、EDR、企業 filter 與防火牆可能改變一般 FIB 查詢的結果。
- IPv4 /32 不會覆蓋 IPv6 AAAA 流量。
- 有路由不表示遠端 port 開放、TLS 合法或應用授權成功。

所以必須把 longest-prefix match 視為**同一選路域內的比較規則**，不是對整個作業系統和遠端網路的替代模型。

## 4. TUN 的位置：虛擬 L3 介面，不是代理協定

TUN 是三層虛擬網路介面。核心像對待一般 IP 介面一樣，把選定的 IPv4/IPv6 封包送給它；使用者空間程式讀取後，可重建連線、套規則並以另一條外連送出。它不同於二層 TAP：TUN 關心的是 IP packet，不是乙太網 frame。

在 Mihomo 中，TUN 是一個 inbound。開啟 auto-route 後，Mihomo 依平台能力調整系統路由，將目標流量導進 TUN。route-exclude-address 是這一個**自動導流階段**的排除集合。官方 [TUN 文件](https://wiki.metacubex.one/en/config/inbound/tun/) 對此的描述就是：auto-route 開啟時，指定子網不會被導到 TUN。

這兩段設定作用於不同位置：

```yaml
# OS 選路層：命中後不要自動導入 TUN
tun:
  enable: true
  auto-route: true
  route-exclude-address:
    - 103.143.81.55/32
```

```yaml
# Mihomo 規則層：封包已被核心接收，選 DIRECT 出站
rules:
  - IP-CIDR,103.143.81.55/32,DIRECT,no-resolve
  - MATCH,PROXY
```

| 問題 | route-exclude-address | IP-CIDR + DIRECT |
| --- | --- | --- |
| 決策時機 | OS 導入 TUN 前 | 進入 Mihomo 後 |
| 比對資料 | 封包當下的目的 IP | Mihomo 可見的目的 IP |
| 主要效果 | 保留 OS 的原始出口 | 由核心以直接出站建立連線 |
| 是否繞過 TUN | 目標是；以實際路由表驗證 | 否 |
| 是否理解網域名 | 否 | IP-CIDR 本身否；需要 DOMAIN 規則 |
| 是否是遠端防火牆設定 | 否 | 否 |

### 4.1 Mihomo 的實作選項不是跨平台承諾

Mihomo 官方 TUN 文件列出 system、gvisor 與 mixed 三種 stack：system 倚賴 OS 協定棧；gvisor 是使用者空間網路棧；mixed 對 TCP 使用 system、UDP 使用 gVisor。文件建議無相容性問題時可採 mixed，但它不是「一定更快」或「一定無漏流」的保證。

Linux 的 auto-redirect 又是另一層功能：文件標示它只支援 Linux，會透過 iptables/nftables 將 TCP 流量導向 TUN，並要求 auto-route。Windows/macOS 不應照抄這種 Linux 專屬配置。若有多張網卡，auto-detect-interface、strict-route、routing-mark 與企業 VPN policy 也都會影響最終資料面。

其中 auto-detect-interface 的工作是偵測核心自身外連所應使用的實體出口，避免代理節點的上游連線又被導回 TUN 形成迴圈；它不是依每個網站自動選最佳線路的策略引擎。strict-route 則是平台特定的更嚴格導流／防漏設計，可能與虛擬機、其他 VPN 或特殊網路程式衝突。兩者都不改變 CIDR 的位元語義，只改變「哪些封包在哪個 OS 路徑被攔截」。

## 5. 一條網域連線如何通過 Mihomo

下圖是典型 TCP/HTTPS 資料面。並非每個應用都必然走完整流程：它可能直接連 literal IP、使用快取、使用 DoH、或自行管理 resolver。但這個模型足以解釋 CIDR 規則為何會在不同層失效。

```text
應用程式
  │  1. 查詢 hk2.w0x7ce.eu，或從快取取得 IP
  ▼
DNS resolver / Mihomo DNS
  │  2. 回覆真實 A/AAAA，或 Fake-IP
  ▼
connect(目的 IP:port)
  ▼
OS policy routing / FIB
  │  3a. 命中排除 → 原實體介面
  │  3b. 未排除   → TUN
  ▼
Mihomo TUN inbound
  │  4. 接收封包；依 stack 建立連線中繼資料
  │     Fake-IP 可恢復對應的 FQDN
  ▼
Mihomo rules（由上而下，第一條命中）
  │  5. DOMAIN / IP-CIDR / 程序 / 介面等分類
  ▼
Outbound
  │  6a. DIRECT → 本機直接對目標撥號
  │  6b. Proxy  → 先連代理節點，再由其轉送
  ▼
實體介面 → 網關 → Internet → 遠端服務
```

根據 [Mihomo Rules 文件](https://wiki.metacubex.one/en/config/rules/)，規則是由上到下比對，最先命中的規則有優先權。這是規則引擎的順序，不是 FIB 的 longest-prefix match；兩套排序邏輯不能混用。

### 5.1 DIRECT 究竟控制了什麼

DIRECT 是 Mihomo 的出站選擇：核心不將該連線交給 proxy node，而以本機網路直接對目標建立外連。連線仍可能先進 TUN，經過 DNS hijack、Fake-IP 映射、規則比對和 dashboard 日誌。

因此：

- DOMAIN,hk2.w0x7ce.eu,DIRECT 表達「這個服務由 Mihomo 直接出站」。
- route-exclude-address: 103.143.81.55/32 表達「OS 不要把這個目的 IP 自動導入 TUN」。

前者是核心出站政策，後者是本機捕獲政策。需要前者、後者或兩者，要由需求本身決定。

## 6. Fake-IP：為什麼真實 /32 可能完全碰不到封包

Mihomo DNS 的 enhanced-mode 可選 fake-ip 或 redir-host，官方文件目前列出的預設為 redir-host。fake-ip 模式會為網域回覆一個虛擬位址，並保留「Fake-IP 對應哪個 FQDN」的映射。應用程式後續對這個虛擬位址呼叫 connect()，TUN 核心便能還原網域意圖並套用 DOMAIN 規則。

時序如下：

```text
網域：hk2.w0x7ce.eu
真實 A 記錄（示意）：103.143.81.55

Fake-IP DNS 回覆：198.18.x.y（示意）
OS FIB 實際看到：198.18.x.y
Mihomo 可恢復為：hk2.w0x7ce.eu
```

這時 route-exclude-address 裡的 103.143.81.55/32 在 OS 選路階段自然不會命中。不是 CIDR 寫錯，也不代表 Mihomo 沒有讀到設定；而是該規則比對的資料是**當下目的 IP**，此時它是 Fake-IP。

### 6.1 服務意圖優先：先使用 DOMAIN 規則

若真正要表達的是「指定服務永遠直連」，應先寫 FQDN 規則：

```yaml
rules:
  - DOMAIN,hk2.w0x7ce.eu,DIRECT
  - MATCH,PROXY
```

它可以隨服務 A 記錄、CNAME、負載平衡和 IPv6 變動而保留原意；前提是 Mihomo 能取得 hostname 中繼資料，而且這條規則放在廣泛規則和 MATCH 之前。若需要整個子網域族群，才考慮 DOMAIN-SUFFIX，並重新評估不必要擴大的範圍。

### 6.2 真的要在 OS 路由層繞過 TUN

如果需求不是「Mihomo 直接出站」，而是「這個網域絕不能進 TUN」，就要讓 OS 看見真實目的 IP。Mihomo DNS 的 fake-ip-filter 可以令匹配名稱不取得 Fake-IP：

```yaml
dns:
  enable: true
  enhanced-mode: fake-ip
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - 'hk2.w0x7ce.eu'

tun:
  enable: true
  auto-route: true
  route-exclude-address:
    - 103.143.81.55/32
```

也可用 rule mode 精確定義真實 IP 與 Fake-IP 的分界：

```yaml
dns:
  enhanced-mode: fake-ip
  fake-ip-filter-mode: rule
  fake-ip-filter:
    - 'DOMAIN,hk2.w0x7ce.eu,real-ip'
    - 'MATCH,fake-ip'
```

這會改變 DNS 路徑、名稱映射與應用相容性；真實 A/AAAA 也可能變動。因此應先用 DOMAIN,DIRECT 表達服務意圖，只有確實需要在**OS 導流前**排除時，才加入 DNS 例外和對應的 IPv4/IPv6 前綴。

## 7. 配置按目標選，不要把所有規則疊在一起

### 7.1 目標 A：一個 literal IPv4 不進 TUN

適合應用本來就連 IP，或需要在系統導流時排除一個精確目的地。

```yaml
tun:
  enable: true
  auto-route: true
  route-exclude-address:
    - 103.143.81.55/32
```

要驗證的是 OS FIB 是否選到原有網路介面，而不是只確認 YAML 能載入。此規則不會自動照顧相同服務的其他 IP、IPv6、網域或遠端存取權。

### 7.2 目標 B：一個服務名稱由 Mihomo 直接出站

適合需要維持 TUN 規則、可觀測性或 Fake-IP 映射，但不走代理節點。

```yaml
rules:
  - DOMAIN,hk2.w0x7ce.eu,DIRECT
  - MATCH,PROXY
```

這不保證封包未進 TUN；它保證的是在該規則命中時，核心選擇 DIRECT outbound。

### 7.3 目標 C：已進核心的 literal IP 直連

適合沒有可用網域，且接受流量先被 Mihomo 接收。

```yaml
rules:
  - IP-CIDR,103.143.81.55/32,DIRECT,no-resolve
  - MATCH,PROXY
```

no-resolve 是 IP 類規則的附加項，用於避免 Mihomo 為此 IP 規則再做 DNS 解析。它不是停止全部 DNS、不是修改 OS 路由表，也不會撤銷先前已發生的 DNS 行為。

### 7.4 決策表

| 真實需求 | 優先機制 | 需要留意 |
| --- | --- | --- |
| 單一 IPv4 完全不進 TUN | route-exclude-address: x.x.x.x/32 | Fake-IP、IPv6、實際 FIB |
| 某個服務名稱直連 | DOMAIN,name,DIRECT | 規則順序、FQDN 中繼資料 |
| 網域完全不進 TUN | DNS 真實 IP 例外 + A/AAAA 排除 | DNS 變動與相容性成本 |
| 已攔截的網段直連 | IP-CIDR,prefix,DIRECT | 前綴不可過大，不能改 OS 導流 |

## 8. Mihomo 的流量控制矩陣

Mihomo 不是只靠一條 rules 清單控制流量；不同設定在不同位置作用。

| 機制 | 階段 | 控制或比對資料 | 能做什麼 | 不應誤解為 |
| --- | --- | --- | --- | --- |
| auto-route | OS 選路 | 目的 IP、TUN 路由策略 | 導入 TUN | 通用跨平台 route script |
| route-exclude-address | OS 選路 | 封包當下的目的 IP 前綴 | 不自動導入 TUN | 網域規則或伺服器 ACL |
| dns-hijack | DNS 攔截 | DNS 目的位址/port | 將命中 DNS 交內部 resolver | 必能攔截 DoH、私有 DNS 或所有 app |
| fake-ip | DNS 與映射 | FQDN ↔ 虛擬 IP | 保留名稱意圖供後續分類 | OS 仍能看見真實 IP |
| fake-ip-filter | DNS 回覆 | FQDN | 指定名稱回真實 IP | 無成本的相容性開關 |
| DOMAIN / DOMAIN-SUFFIX | Mihomo 規則 | hostname | 以服務語意選出站 | 可在 OS FIB 階段比對 |
| IP-CIDR | Mihomo 規則 | 目的 IP 前綴 | 對已接收流量分類 | 改寫 auto-route 的排除結果 |
| 程序、套件、介面規則 | Mihomo 規則 / TUN 能力 | process、package、inbound 等 | 細化應用層級策略 | 所有平台都同樣支援 |
| DIRECT / proxy group | outbound | 規則結果 | 選直接撥號或代理節點 | 遠端身分授權或防火牆繞過 |

Linux 還有 route-exclude-address-set、auto-redirect 與 nftables 相關能力。官方文件對它們列出 Linux、auto-route、auto-redirect、routing-mark 等前提與互斥條件；它們應按受管理系統的實際路由環境驗證，不能當作 Windows 或 macOS 的通用答案。

## 9. 驗證應分層：能開網站不等於路徑正確

### 9.1 先看 DNS 回覆

Windows：

```powershell
Resolve-DnsName hk2.w0x7ce.eu -Type A
Resolve-DnsName hk2.w0x7ce.eu -Type AAAA
```

Linux：

```bash
resolvectl query hk2.w0x7ce.eu
getent ahostsv4 hk2.w0x7ce.eu
```

macOS：

```bash
dig hk2.w0x7ce.eu A
dig hk2.w0x7ce.eu AAAA
```

如果結果是 Fake-IP 範圍，真實 103.143.81.55/32 就不會在 OS FIB 階段命中。此時要選擇：保留 Fake-IP 並用 DOMAIN,DIRECT，或為該名稱配置 real-IP 例外。

### 9.2 再看 OS 實際選路

Windows：

```powershell
Find-NetRoute -RemoteIPAddress 103.143.81.55 |
  Format-List DestinationPrefix,NextHop,InterfaceAlias,RouteMetric
```

Linux：

```bash
ip route get 103.143.81.55
```

macOS：

```bash
route -n get 103.143.81.55
```

這是驗證「不進 TUN」最有價值的一步。看的是系統為該目的 IP 實際選中的 interface、gateway 與 route source，不是設定檔是否存在一行 /32。

### 9.3 再看 Mihomo 命中了哪條規則

從 Mihomo Dashboard 或日誌確認：

1. 原始目的 IP 和可見的 hostname；
2. 最先命中的規則；
3. 最終 outbound 是 DIRECT 還是某代理群組；
4. DNS 模式與 Fake-IP filter 是否命中。

規則是 first-match。若較早規則已命中，後面再精確的 /32 或 DOMAIN 都不會執行。

### 9.4 最後才是 HTTPS 與應用測試

保留 hostname，讓 SNI 與憑證驗證正常運作：

```powershell
curl.exe --noproxy "*" -I --connect-timeout 8 https://hk2.w0x7ce.eu/
```

Linux／macOS：

```bash
curl --noproxy '*' -I --connect-timeout 8 https://hk2.w0x7ce.eu/
```

若要固定測試一個 IP，同時維持正確 hostname 與 TLS 驗證：

```bash
curl --noproxy '*' --resolve hk2.w0x7ce.eu:443:103.143.81.55 \
  -I --connect-timeout 8 https://hk2.w0x7ce.eu/
```

不要改成用 HTTPS IP 位址直接連，也不要加 --insecure 來掩蓋憑證問題。ping 和 Test-NetConnection 只可作為連通性輔助，不能證明 HTTPS 的名稱、SNI、規則命中或實際代理路徑。

## 10. 常見問題的正確定位順序

| 現象 | 常見原因 | 第一個檢查點 |
| --- | --- | --- |
| 加了真實 /32，網域仍進 TUN | Fake-IP 回覆虛擬 IP | DNS A/AAAA 與 Fake-IP filter |
| DOMAIN 規則仍走代理 | 較早規則或 MATCH 搶先命中 | Mihomo connection log |
| IPv4 直連但偶爾仍走代理 | 系統選用 IPv6 AAAA | IPv6 DNS 與 IPv6 route |
| 路由表正確但連線失敗 | TLS、SNI、port、ACL、企業防火牆 | 保留 hostname 的 curl |
| 改一個 IP 後很快失效 | DNS、CDN、負載平衡、服務遷移 | 改以 FQDN 規則表達意圖 |
| DIRECT 後仍受安全軟體影響 | DIRECT 不會繞過 OS policy | VPN、EDR、防火牆與 policy route |

有效的排錯順序是：**DNS 回覆 → OS FIB → Mihomo 命中規則 → outbound → TLS/應用層**。一次只改一個層次，保留前後輸出，否則問題會無法歸因。

## 11. 本機 TUN 排除不是伺服器防火牆白名單

| 項目 | 本機 route-exclude-address | 遠端 firewall allowlist |
| --- | --- | --- |
| 執行位置 | 你的電腦或手機 | 遠端伺服器／雲端網路邊界 |
| 判斷對象 | 本機要送往哪個目的 IP | 對方是否接受來源、port、協定或身分 |
| 典型效果 | 避免自動導入 TUN | 放行或拒絕服務連線 |
| 是否完成授權 | 否 | 可能是一層，通常仍需 TLS、帳號或 token |
| 是否能改變對端 policy | 否 | 是 |

把 103.143.81.55/32 寫進本機設定，不會在遠端建立白名單，也不會證明對服務有權限。反之，伺服器允許某個來源，也不會決定本機是否先把流量送進 TUN。這兩類控制都重要，但絕不能混為一談。

## 12. 部署前檢查清單

- [ ] 單一 IPv4 使用 /32，不為方便誤放大成 /24 或 /0。
- [ ] 服務意圖優先用 DOMAIN，而非只鎖定可能變動的一個 A 記錄。
- [ ] 已明確區分「不進 TUN」和「進 TUN 後 DIRECT」。
- [ ] Fake-IP 模式下已檢查 OS 實際看到的是什麼目的 IP。
- [ ] IPv4 和 IPv6 都已納入規則與驗證。
- [ ] DOMAIN 或 IP-CIDR 位於更廣泛規則、MATCH 之前。
- [ ] 已以 Find-NetRoute、ip route get 或 route -n get 驗證實際 FIB。
- [ ] HTTPS 測試保留 hostname 與憑證驗證，不以 --insecure 掩蓋問題。
- [ ] 沒有把本機路由例外誤認成防火牆、身份認證或安全繞過。

## 結語

103.143.81.55/32 的定義非常單純：它是只匹配一個 IPv4 位址的 CIDR 主機前綴。真正的工程問題，是判斷它要放在哪一層：

- 在 **OS 選路**，控制封包是否進 TUN；
- 在 **Mihomo 規則**，控制已攔截流量是否 DIRECT；
- 在 **DNS/Fake-IP**，決定名稱與當下目的 IP 是否一致；
- 在 **DOMAIN 規則**，表達服務本身的直連意圖；
- 在 **遠端安全邊界**，以獨立的 TLS、帳號、token 和 firewall 管理存取。

當這些責任邊界清楚後，Mihomo 就不是「加一條神奇規則」的黑箱。CIDR 是位址語言，TUN 是資料面入口，DNS 與規則引擎負責理解流量，DIRECT 與 proxy group 則決定核心最後如何出站。

延伸閱讀：[RFC 4632：CIDR](https://www.rfc-editor.org/rfc/rfc4632.html)、Mihomo 的 [TUN 設定](https://wiki.metacubex.one/en/config/inbound/tun/)、[DNS 設定](https://wiki.metacubex.one/en/config/dns/) 與 [Rules 文件](https://wiki.metacubex.one/en/config/rules/)。
