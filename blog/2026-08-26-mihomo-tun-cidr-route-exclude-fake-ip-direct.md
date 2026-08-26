---
slug: mihomo-tun-cidr-route-exclude-fake-ip-direct
title: "Clash Verge 與 Mihomo TUN：CIDR 排除路由、/32、Fake-IP 與單一 IP 直連"
description: "從 IPv4 CIDR、最長前綴匹配到 Mihomo TUN、Fake-IP 與 DOMAIN 規則，釐清 103.143.81.55/32 為何可用於單一 IP 直連，以及何時仍要處理 DNS。"
authors: [tianrking]
tags: [網路, 路由, CIDR, TUN, Mihomo, Clash Verge, DNS]
date: 2026-08-26
keywords: [Clash Verge, Mihomo, TUN, CIDR, /32, route-exclude-address, Fake-IP, DNS, DIRECT, 最長前綴匹配]
---

在 Clash Verge / Mihomo 裡看到這段設定時，最常見的反應是：「`103.143.81.55/32` 是不是一段網段？」

```yaml
tun:
  auto-route: true
  route-exclude-address:
    - 103.143.81.55/32
```

答案是：它不是一段可容納多台主機的網段，而是**剛好只指向 `103.143.81.55` 這一個 IPv4 位址的 host route（主機路由）**。在 TUN 的語境下，這通常用來告訴作業系統：「通往這個目的 IP 的流量不要被自動導入 Mihomo 的 TUN 路徑，走原本的網路出口。」

不過，這句話有三個很重要的前提：

1. 它是**本機的目的地選路**，不是伺服器防火牆白名單。
2. 它只看封包當下的**目的 IP**；如果 DNS Fake-IP 把網域先映射成虛擬位址，單排除真實 IP 可能完全碰不到。
3. Mihomo 的 `rules:` 是另一套「由上往下，第一條命中就停止」的規則系統；作業系統的路由表則通常依**最長前綴匹配**選路。兩者不要混為一談。

本文以 `103.143.81.55/32` 與 `hk2.w0x7ce.eu` 作為教學例子，不把它們當成任何伺服器安全策略、固定 IP 承諾或可複製到所有網路的結論。

:::info[先講可操作的結論]

如果你的真正意圖是「`hk2.w0x7ce.eu` 這個主機名稱永遠直接連線」，優先把**精確網域規則**放在 Mihomo 規則頂端：

```yaml
rules:
  - DOMAIN,hk2.w0x7ce.eu,DIRECT
  - MATCH,PROXY
```

如果還希望**任何直接以 `103.143.81.55` 為目的地的封包**不要進 TUN，再加上：

```yaml
tun:
  auto-route: true
  route-exclude-address:
    - 103.143.81.55/32
```

若啟用了 `fake-ip`，再確認 DNS 不會先把該網域回覆成假位址；否則 `route-exclude-address` 看到的可能不是 `103.143.81.55`。

:::

## 1. 先拆開四個不同層次

「直連」這兩個字在代理設定裡很容易被過度簡化。實際上至少有四層：

| 層次 | 問的問題 | 常見設定 | 它**不**負責什麼 |
| --- | --- | --- | --- |
| 作業系統選路 | 這個目的 IP 的封包先交給哪個介面／下一跳？ | `tun.route-exclude-address`、系統路由表 | 不決定網域規則，也不改伺服器 ACL。 |
| Mihomo 流量規則 | 已進入 Mihomo 的連線，要選哪個 outbound？ | `DOMAIN,...,DIRECT`、`IP-CIDR,...,DIRECT` | 不一定表示封包從未碰過 TUN。 |
| DNS 映射 | 應用程式拿到真實 IP 還是 Fake-IP？ | `enhanced-mode`、`fake-ip-filter` | 不保證實際 TCP/TLS 一定成功。 |
| 遠端伺服器防火牆 | 伺服器允許哪個來源位址、埠與協議進入？ | nftables、iptables、雲端安全群組 | 不會替客戶端選擇是否繞過 TUN。 |

把問題放回正確的層次，排錯就不會變成「我加了白名單，為什麼代理還在接管？」

Mihomo 的官方 TUN 文件把 `route-exclude-address` 定義為：在啟用 `auto-route` 時排除自訂子網；它是 TUN 自動選路的輸入，而不是代理規則的別名。[Mihomo TUN 文件](https://wiki.metacubex.one/en/config/inbound/tun/) 同時也說明，Linux 專用的 `route-exclude-address-set` 有額外 nftables、`auto-route` 與 `auto-redirect` 條件，不能把它和跨平台的普通 `route-exclude-address` 混用。

## 2. IPv4、CIDR 與 `/32` 到底在描述什麼

IPv4 位址固定為 **32 bits**，只是不方便直接閱讀二進位，所以通常寫成四個十進位 octet，例如：

```text
103.143.81.55
01100111.10001111.01010001.00110111
```

CIDR 把「前面多少 bits 是固定前綴」寫在斜線後面。RFC 4632 定義，IPv4 的 CIDR 前綴長度範圍是 `/0` 到 `/32`，斜線後的數字代表 32-bit 位址中有多少個有效前綴位元；它同時把 `n.n.n.n/32` 列為只含一個位址的 host route。[RFC 4632 §3.1](https://www.rfc-editor.org/rfc/rfc4632.html#section-3.1)

| CIDR | 固定的網路位元 | 剩餘主機位元 | 位址數 | 直覺 |
| --- | ---: | ---: | ---: | --- |
| `0.0.0.0/0` | 0 | 32 | 4,294,967,296 | 所有 IPv4；常被稱為預設路由。 |
| `10.20.0.0/16` | 16 | 16 | 65,536 | 固定前兩個 octet。 |
| `10.20.30.0/24` | 24 | 8 | 256 | 固定前三個 octet。 |
| `103.143.81.55/32` | 32 | 0 | 1 | 只命中 `103.143.81.55`。 |

因此，`/32` 不是「遮罩特別嚴格的局域網」，而是「沒有剩餘主機位元」：32 個 bit 全部固定，只有這一個目的地能命中。

:::note[不要只背 /24]

`/24` 很常見，但 CIDR 不是只有 `/8`、`/16`、`/24` 這些舊類別感很強的寫法。只要前綴連續，`/13`、`/27`、`/31`、`/32` 都是合法的 CIDR。對 TUN 排除來說，應該選**能表達真正意圖的最小範圍**：只需一個 IP 就用 `/32`，不要因為方便而放大成 `/24` 或 `/16`。

:::

## 3. 為什麼 `/32` 能壓過 TUN 的預設路徑：最長前綴匹配

系統路由表常會同時有多條看起來都能匹配同一個目的地的路由。典型的邏輯模型如下：

```text
0.0.0.0/0          → Mihomo TUN
103.143.81.55/32   → 原本的實體網卡與預設閘道
```

當目標是 `103.143.81.55` 時，兩條都「可匹配」，但 `/32` 比 `/0` 更具體。IP 選路採用最長前綴匹配（longest-prefix match），所以會優先選更長、更精確的前綴；若前綴長度相同，才會再涉及 route metric、優先級與作業系統策略。RFC 4632 將這個模型描述為 more-specific route 優於 aggregate route 的前綴選擇。[RFC 4632](https://www.rfc-editor.org/rfc/rfc4632.html)

但這裡應避免一個過度推論：**不要假定每個 Mihomo、每個作業系統、每個 TUN stack 都會用完全相同的路由表呈現方式實作排除。** Mihomo 文件保證的是 `auto-route` 下「排除自訂子網」的功能語意；實際是否顯示為一條可見的 `/32` 路由、路由規則或平台特定機制，應以本機路由查詢和實際連線結果為準。

這也說明了 `/0` 與 `/32` 的風險差異：

```text
103.143.81.55/32  → 只影響一個 IPv4 目的地
103.143.81.0/24  → 影響 256 個位址
0.0.0.0/0        → 幾乎等於關掉所有 IPv4 的 TUN 導流
```

## 4. `route-exclude-address`、`IP-CIDR,DIRECT` 與 `DOMAIN,DIRECT` 不是同一件事

這三種寫法名稱相近，作用的位置不同：

| 寫法 | 主要匹配對象 | 主要發生層 | 適合的意圖 |
| --- | --- | --- | --- |
| `tun.route-exclude-address: 103.143.81.55/32` | 作業系統封包的目的 IP | TUN 自動選路 | 讓這個真實 IP 不被導入 TUN。 |
| `IP-CIDR,103.143.81.55/32,DIRECT` | Mihomo 已看到的目的 IP | Mihomo 規則 | 流量進入 core 後，指定這個 IP 使用 `DIRECT` outbound。 |
| `DOMAIN,hk2.w0x7ce.eu,DIRECT` | 完整網域名稱 | Mihomo 規則 | 按服務名稱做精確直連，較能承受 IP 變動。 |

Mihomo 的路由規則是**自上而下、上面的優先**；`DOMAIN` 匹配完整網域，而 `IP-CIDR` 匹配 IP 範圍。官方規則文件也示範了 `/32` 的 source-IP 寫法與 `DOMAIN,...,DIRECT` 的三欄格式。[Mihomo Route Rules](https://wiki.metacubex.one/en/config/rules/)

因此，下面的規則順序有意義：

```yaml
rules:
  # 精確主機名必須在廣泛規則與 MATCH 之前
  - DOMAIN,hk2.w0x7ce.eu,DIRECT

  # 只有在流量真的以此真實 IP 進入 Mihomo 時才會命中
  - IP-CIDR,103.143.81.55/32,DIRECT,no-resolve

  # 這條是兜底；放在前面會吃掉後面的規則
  - MATCH,PROXY
```

`no-resolve` 的含義不是「強制直連」，而是避免為了 IP 類規則的比對再觸發 DNS 解析；它只屬於目的 IP 類規則的額外參數。[Mihomo 規則參數說明](https://wiki.metacubex.one/en/config/rules/#no-resolve)

## 5. TUN + Fake-IP：為什麼只排除真實 IP 仍可能不夠

Fake-IP 的目標不是偽造遠端伺服器，而是讓 Mihomo 在 TUN 攔截到應用程式連線時仍能保留「這條連線原本請求哪個網域」的關聯。簡化流程如下：

```text
App
 │  DNS: hk2.w0x7ce.eu ?
 ▼
Mihomo DNS（fake-ip）
 │  回覆一個設定範圍內的 Fake-IP，例如 198.18.x.x
 ▼
App 對 Fake-IP 建立 TCP/TLS 連線
 │
 ▼
TUN / Mihomo 依 Fake-IP 映射還原網域，套用 DOMAIN 規則，
再決定要以哪個出口去解析與連線真實目的地。
```

Mihomo 官方 DNS 文件指出，`enhanced-mode` 可使用 `fake-ip`，而 `fake-ip-filter` 中的網域不會得到 Fake-IP 映射；DNS 文件也特別說明 TUN 的預設 IPv4 位址會參考 fake-IP range。[Mihomo DNS configuration](https://wiki.metacubex.one/en/config/dns/)

這就產生一個常見現象：

```text
你排除： 103.143.81.55/32
App 實際先連：198.18.0.42（Fake-IP）
```

在封包剛進系統選路時，它的目的地是 `198.18.0.42`，不是 `103.143.81.55`。所以那條 `/32` 排除規則根本尚未命中；封包仍進 TUN，之後才由 Mihomo 找回原始網域。這不是 `/32` 失效，而是**匹配的時點與看到的目的位址不同**。

### 5.1 需要網域直連時：先加 `DOMAIN,...,DIRECT`

如果你的意圖是「這個 FQDN 一律直接走」，應先用網域規則表達它：

```yaml
rules:
  - DOMAIN,hk2.w0x7ce.eu,DIRECT
  - MATCH,PROXY
```

這條規則的價值是它表達了真正意圖：**主機名**。日後 IP 變更、同一服務新增 IPv6、DNS 回覆多個 A 記錄，仍有機會保持正確；相反地，一條寫死的 `/32` 只認得當下那個 IP。

### 5.2 必須讓應用拿到真實 IP 時：加 `fake-ip-filter`

某些程式、LAN 設備、內網服務或診斷工具需要看到真實解析結果。這時可以把特定主機名排除 Fake-IP：

```yaml
dns:
  enhanced-mode: fake-ip
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - 'hk2.w0x7ce.eu'
```

在預設 `blacklist` 模式中，命中的名稱不會拿到 Fake-IP。注意這不是「萬用加速開關」：它會改變 DNS 的可觀測性與後續選路條件，應只對確實需要的精確主機名使用。

如果你的設定已採用 Mihomo 的 `rule` 型 Fake-IP 過濾器，語法不同，應使用 `real-ip` / `fake-ip` 動作，而且整個清單要依該模式的規則語法整理：

```yaml
dns:
  enhanced-mode: fake-ip
  fake-ip-filter-mode: rule
  fake-ip-filter:
    - DOMAIN,hk2.w0x7ce.eu,real-ip
    - MATCH,fake-ip
```

Mihomo 文件明確指出：`rule` 模式的 Fake-IP 過濾器採和路由規則相同的自上而下比對，並支援 `DOMAIN*` 與 `MATCH`；因此不要把這一段和普通字串型 `fake-ip-filter` 混著貼。[Mihomo Fake-IP filter modes](https://wiki.metacubex.one/en/config/dns/#fake-ip-filter-mode)

### 5.3 一份保守的組合範例

下面不是「所有人都要複製」的模板，而是示範每一層各自解決什麼。合併前先備份目前生效的設定。

```yaml
tun:
  enable: true
  auto-route: true
  route-exclude-address:
    # 僅針對這一個真實 IPv4 目的地，不擴大成 /24
    - 103.143.81.55/32

dns:
  enhanced-mode: fake-ip
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    # 讓這個 FQDN 回覆真實 IP；若既有清單很多，保留它們
    - 'hk2.w0x7ce.eu'

rules:
  # 放在 GEOSITE、GEOIP、RULE-SET 與 MATCH 等廣泛規則之前
  - DOMAIN,hk2.w0x7ce.eu,DIRECT
  - IP-CIDR,103.143.81.55/32,DIRECT,no-resolve
  - MATCH,PROXY
```

這三項是可疊加的，但不是永遠都必需：

- 只希望按**服務名**直連：從 `DOMAIN,...,DIRECT` 開始。
- 只希望某一個**字面 IP**不進 TUN：使用 `route-exclude-address`。
- 啟用 Fake-IP，且應用或本機路由必須看到**真實 IP**：再考慮 `fake-ip-filter`。

## 6. Clash Verge 裡應該放在哪裡

Clash Verge 是 Mihomo core 的圖形化前端之一；核心 YAML 的鍵與行為仍應以 Mihomo 文件為準。Clash Verge Rev 的公開設定範例也包含 `tun.auto-route`、`dns.enhanced-mode: fake-ip`、`fake-ip-filter` 與 `rules`，並指向 Mihomo 官方文件作為完整設定依據。[Clash Verge Rev configuration example](https://github.com/clash-verge-rev/clash-verge-rev.github.io/blob/main/docs/guide/config.md)

實務上請遵守這四個原則：

1. **不要直接把變更只寫進會被訂閱更新覆蓋的原始 profile。** 使用你當前版本介面提供的 Merge、Override、Extend Config 或等效機制；名稱會隨版本改變。
2. **先看最終生效設定。** GUI 的 TUN 全域開關、訂閱內容與擴充設定可能彼此覆蓋；不要只看某一個編輯視窗就判定規則已載入。
3. **規則放在廣泛規則前。** `DOMAIN,hk2.w0x7ce.eu,DIRECT` 必須在 `MATCH`、大型 `RULE-SET` 或通用代理規則之前。
4. **每次只改一層。** 先驗證 `DOMAIN`，再驗證 Fake-IP，最後才加 `/32` 排除；否則出問題時無法知道是哪一層造成的。

## 7. 驗證：不要只看「能打開網頁」

網頁能打開不等於已經從你預期的路徑出去：快取、既有連線、服務端 CDN、瀏覽器 proxy 設定都可能讓表面結果看起來正常。建議把驗證拆成三段。

### 7.1 確認作業系統選路

先開啟 TUN、套用設定並重新載入 core，再查詢目標 IP 的實際路徑。

Windows PowerShell：

```powershell
Find-NetRoute -RemoteIPAddress 103.143.81.55 |
  Format-List DestinationPrefix,NextHop,InterfaceAlias,RouteMetric

Test-NetConnection 103.143.81.55 -Port 443
```

Linux：

```bash
ip route get 103.143.81.55
```

macOS：

```bash
route -n get 103.143.81.55
```

預期不是某個固定文字，而是：結果應能解釋該目標最後為何選到實體介面或預期的 next hop。若結果仍指向 TUN，先確認 `auto-route` 已生效、設定是否被前端覆蓋，以及實際目標是否仍是這個 IPv4。

### 7.2 確認 DNS 看到的是 Fake-IP 還是真實 IP

Windows 可觀察系統解析結果：

```powershell
Resolve-DnsName hk2.w0x7ce.eu -Type A
```

若回覆落在你設定的 Fake-IP range，例如常見的 `198.18.x.x`，表示 `fake-ip-filter` 沒有命中或不是生效中的設定。若回覆真實 A 記錄，還要繼續看後續的路由與 Mihomo 連線記錄；DNS 真實並不自動證明 TCP 一定直連。

### 7.3 確認 Mihomo 命中的規則與 TLS

把日誌暫時調到 `info` 或在控制台的 Connections / Logs 檢查，確認這個連線命中的是 `DOMAIN,hk2.w0x7ce.eu,DIRECT`，而不是後面的通用規則。然後用不繞過 TLS 驗證的方式測試：

```powershell
curl.exe -I --noproxy "*" --connect-timeout 8 https://hk2.w0x7ce.eu/
```

`--noproxy "*"` 只用來避免命令列另外繼承 HTTP proxy 環境變數；它不會神奇地繞過作業系統的 TUN。測試時**不要**加 `-k` / `--insecure`，因為那會關閉你本來要一起驗證的憑證與主機名稱檢查。也不要用 `https://103.143.81.55/` 取代網域來驗 TLS：多數網站憑證是簽給網域名稱，直接以 IP 存取會造成正常而有價值的名稱不匹配。

:::warning[不要拿 Ping 當作唯一證據]

`ping` 是 ICMP；目標可能禁止 ICMP，但 HTTPS 仍正常，也可能 ICMP 回覆正常而 TCP/443 走了另一條路。對這個問題而言，`Find-NetRoute` / `ip route get`、DNS 回覆、Mihomo 規則命中與一次不關閉 TLS 驗證的 HTTPS 請求，合在一起才有足夠證據。

:::

## 8. 「本機繞過 TUN」絕對不等於「伺服器防火牆白名單」

這兩件事常被同一句「白名單」混在一起，但方向完全相反：

| 問題 | 本機 TUN 排除 | 伺服器防火牆白名單 |
| --- | --- | --- |
| 控制者 | 你的電腦或手機 | 遠端伺服器管理者 |
| 匹配重點 | **目的地** IP／網域與本機選路 | 到達伺服器的**來源** IP、埠、協議 |
| 作用 | 決定封包是否導入 Mihomo、使用哪個出口 | 決定入站連線是否被接受 |
| 例子 | `route-exclude-address: 103.143.81.55/32` | 只允許某些公網來源連到 TCP/443 |
| 不會做到的事 | 不能讓伺服器自動放行你 | 不能讓客戶端自動繞過 TUN |

若你用 TUN 代理，伺服器看到的來源位址還可能是代理出口的公網 IP，而不是你的本地 LAN 位址。反過來，就算伺服器已對你的 ISP 公網 IP 放行，本機依然可能把封包送進錯誤的 TUN 或 Proxy 出口。這兩個方向需要各自驗證與各自最小化授權。

## 9. 常見錯誤與風險邊界

### 把 `/32` 當成 DNS 規則

`103.143.81.55/32` 不知道 `hk2.w0x7ce.eu` 這個名稱。若服務換 IP、啟用 IPv6、使用多 A 記錄或前面加了 CDN，原本的 `/32` 可能變成無效或只影響部分流量。長期意圖通常應先以 `DOMAIN` 表達。

### 把 `DIRECT` 當成「完全不經過任何本機網路控制」

在 Mihomo 裡，`DIRECT` 是一種 outbound 決策；它仍受作業系統路由、DNS、企業端點安全、VPN、NAT 與本機/網關防火牆影響。它不是安全豁免，也不是匿名保證。

### 為了「讓它通」而擴大排除範圍

不要把一個 `/32` 直接擴成 `103.143.81.0/24`，更不要加 `0.0.0.0/0` 或把整個 DNS Fake-IP range 排除。先確認真正的目的 IP、是否有 IPv6、是否由 Fake-IP 導致，再做最小變更。

### 關閉憑證驗證來掩蓋路由問題

`skip-cert-verify` 或 `curl -k` 只能掩蓋 TLS 問題，不能證明直連配置正確，還會降低中間人攻擊的防線。路由、DNS 與 TLS 是三個都應該保留驗證的邊界。

### 忘記既有連線與快取

規則載入後，瀏覽器、系統、HTTP/3 連線池或 Mihomo Fake-IP 映射可能仍使用舊狀態。驗證時重啟有關應用、清楚區分新的連線與既有連線，必要時暫時停用再重新啟用 TUN，避免把歷史連線當作新規則結果。

## 10. 普通使用者的安全檢查清單

```text
[ ] 先備份目前能工作的 profile / merge / override 設定。
[ ] 只排除真正需要的單一 IP：103.143.81.55/32，而不是放大成 /24 或 /0。
[ ] 若意圖是某個網站，先加 DOMAIN,hk2.w0x7ce.eu,DIRECT，並放在 MATCH 前。
[ ] Fake-IP 啟用時，確認 hk2.w0x7ce.eu 是否需要 fake-ip-filter 才能回覆真實 IP。
[ ] 不要混用普通 fake-ip-filter 清單與 rule 模式的 fake-ip-filter 語法。
[ ] 查 OS 選路、DNS 回覆、Mihomo 命中規則與 HTTPS TLS；不要只看瀏覽器能否開頁。
[ ] 不使用 -k、skip-cert-verify 或忽略憑證錯誤來「測通」。
[ ] 記得本機 TUN 排除不是伺服器防火牆白名單；兩者需獨立設定與審核。
[ ] 若 IP、IPv6、CDN 或服務域名有變更，重新檢查規則，不把 /32 當永久身份。
[ ] 任何異常先回退剛加的最小一段設定，而不是一次關閉整個 TUN 或安全機制。
```

## 結語

`103.143.81.55/32` 的含義其實很精確：32 個 IPv4 位元全部固定，所以它只代表一個目的位址。在 Mihomo TUN 裡，這讓它成為「指定單一 IP 繞過自動導流」的好工具；它之所以有效，依賴的是更具體前綴優先於 `/0` 預設路徑的選路原理。

但一個可靠的設定不能只停在 `/32`：需要區分作業系統路由和 Mihomo 規則、理解 Fake-IP 可能先改變封包目的位址、在需要時用 `DOMAIN,...,DIRECT` 表達真正服務意圖，並把遠端防火牆規則留在它自己的安全邊界。這樣做，才能讓「直連」既可驗證，也不犧牲 TLS 與最小授權原則。
