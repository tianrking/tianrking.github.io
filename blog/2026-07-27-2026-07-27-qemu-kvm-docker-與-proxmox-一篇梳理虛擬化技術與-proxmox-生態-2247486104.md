---
slug: "2026-07-27-qemu-kvm-docker-與-proxmox-一篇梳理虛擬化技術與-proxmox-生態-2247486104"
title: "QEMU、KVM、Docker 與 Proxmox：一篇梳理虛擬化技術與 Proxmox 生態"
authors: [w0x7ce]
tags: [微信公眾號]
date: 2026-07-27
description: "从微信公众号导入的文章《QEMU、KVM、Docker 與 Proxmox：一篇梳理虛擬化技術與 Proxmox 生態》，保留原始排版图并提供本地 OCR 转写。"
---

# QEMU、KVM、Docker 與 Proxmox：一篇梳理虛擬化技術與 Proxmox 生態

> 发布于 2026-07-27 22:58:53（微信公众号导出记录）。
>
> 本文来自公众号后台的“导出文章内容”功能。博客正文由导出长图进行本地 OCR 转写，并保留原始排版图用于逐段核对。
>
> 原文链接：[查看原文](http://mp.weixin.qq.com/s?__biz=MzIwMjMyNzIzNw==&mid=2247486104&idx=1&sn=8e380ae34576d1c6c7da6943ad23d888&chksm=96e11f32a1969624d981214b0088f89c0980a4124927bc724935dc542f81a6857e380c16c007#rd)
>
> OCR 转写有效文字约 15448 字；代码、流程图和版式以文末原始排版图为准。

## 正文（本地 OCR 转写）

QEMU、KVM、Docker奥Proxmox:一篇梳理虚凝化技術奥
Proxmox生蔗
original we×x7ce EI V1ajero 2826年7月27日 22:58 德国
提到虚提化。經常售同時看到 QEMU、KVM, Docker、 LXC.Firecracker,Kata Containers、
VMvare、Proxmox、Kubernetes 等名强.

虚搬化技術奥Proxmox生態
QEMU · KVM - Docker · LXC
品
?

这些软體不虚於同一層,也不能直接放在一起比较。
KVM提供LinuX核心中的硬體虚化能力&#58;QEMU负贡虚提概器模型、装置模凝和行控制;
Docker 管理共享主機核心的愿用容器&#58;Proxmox VE 别向上盈合虚摄模器、系統容器、露集、留
存、终路、儒份胞管理介面。
理解盛困生爆的熊键,不是记住更多品名程,而是先分清三件事:

## 1.隔整遗界位龄娜一;

## 2.工作负露實账由什度元件轨行;

## 3.哪些数證只是管理,限些教键真正参與CPU、記博體和装置虚凝化。

## 一、QEMU、KVM、Docker與Proxmox的核心關係

## 一套完整的虚澄化或容器平台,通常可以拆成以下差:

【图一:虑授化技術分】
原用风工作免航

IIvr
Cloxl

SA · I

同一個產品可能覆蓄多,但每一膳的联责仍然不同。
KVN
KVM 是 L1nux 核心中的虚赋化子系統。它使用Intel VT-x、AMD-V、Arm V1rtual1zat1on
Extensions 等硬疆能力,旗GuestCPU据令大架分時開直接在實耀虚理器上執行。
KVN 本身不是完整的虚凝操器管理毫品。它提供的是核心API,仍然需费QEMU、CLoud
Hypervisor、Firecracker 等使用者空醒 VNM 建立纪晚、虚 CPU、装置和生命遇期控制
QENU同時具有南殖主要角色

## 第一種是全系统模裂器。QEHU可以模摄CPU、主楼板、糖和装置,至敦行主楼不同指令集的

作案系统.例如在x86主機上楠疑Arm或RISC-V系统、适拜模式通常使用TCG動朗翻罐,通
用性高,但效能低於硬體助虚提化。

## 第二种是KVN 的使用者空间 VMM带主概购 Guest 使用相同 CPU 架椭时,QEMU 可以把 CPU

轨行交给KVN,自身主囊盛理器模型、Virti0、磁碟、细路、题示和管理介面。遭也是Linux
壹端则Proxnox VE中晨常見的组合。
Docker
Docker Engine 或其上游 Moby 是容器管理引擎。Linux 客器不提供舅立核心,而是共享主操
Linux 核心,两透i遇 namespaces、cgroups、capabilities、secconp、SELinux 或
AppArmor 建立隔雄网资逐控制。
Docker 還虚理缺价、钢路、磁臻區、API 和客器生命遇期。底唇通常由containerd 管理,禹由
runc 或crun 建立實账容器。
因此,Docker 不是量版QEMU,也不是得统愈差上的硬體虚疑機器
Proxmox VE
Proxmox VE 是以 Debian基的虑疑化基强投脂平台。
其中:

- 虚凝機器由 KVM和QEMU 软行;

- 系统容爵由LXC行:

- 董集通讯由 Corosync支握;

- 盖集設定由pmxcfs 同步:

- 留存可以使用 ZFS、Ceph、LVM-thin、NFS、1SCSI 等;

- 管理面由 Web UI、REST API 和一组命令列工具组成。

Proxmox VE 没有重新發明 Hypervisor 核心。主要情值在於把成熟的Linux虚化元件整合成

## 一套可安装、可集化、可储份、可白勤化的早台。

主要虚凝化方式阅睛源技
虚凝化不只分為“虚搅碳器,周“客器。按期隔方式和相容震次,可以分成以下袭類。

## 1.全系统模频

代表技衔包括 QEMU TCG、Bochs、gen5、Renode 和 Sinics.
這熟方案模凝完整CPU與硬遭平台,可以跨措令集积行作繁系統,通合韧州發、嵌人式测试、售系
统保存、蕊益程式分析和CPU架精研究。
主要限制是效能。当每條Guest指令都震要翻经或解程时,不通合一般生至案移负致。

## 2.硬體助的完整虚凝化

代表方案包括:

- L1nux KVM + QEMU;

- Xen;

- VMware ESX1;

- Microsoft Hyper-V;

- FreeBSD bhyve:

- mac0S Virtualization.framework;

- VirtualBox,

每墨虚凝器描有漏立核心,虚授记遍和建發装置,能转行不同作满系统,隔離退界清晰,Guest
相容性高,是通用伺服器虚提化的主流方案。
代债是每量VM都需要白己的核心和部分系统服粉,敬勤時間奥记德體需銷通常高於一般容器。

## 3.半虚摄化

半虚摄化不一定代表整個Guest都經通修改,现代系统更常见的形式,是CPU使用硬體虚疑化,
I/0 使用 Virtio、Xen PV 或 Hyper-V VMBus 等半虚摄化介面。
Virtio 已成高 KVM/QEMU, Firecracker, Cloud Hypervisor、 crosvn 和 Kata
Containers 的重要基理。
它遵免完整模摄傅统硬键装置,可以减少 I/0阴销,但Guest 需要對愿辐动。

## 4. MicroVH

MicroVM 仍然是硬體虚提機器,只是截剪了傅统PC 的大量装置和相容功能。
代表要案包括:

- Firecracker ( `https://github.con/firecracker-microvm/firecracker` )

- Cloud Hypervisor (`https://github.com/cloud-hypervisor/cloud-hypervisor` )

- crosvm ( `https://chromium.` googlesource. com/crosvm/crosvm/ )

- Kata Containers 中的 Dragonball

M1croVN 的目標是额小VMM 攻壁面、提高密展降低敏动成本,常用龄 ServerLess、多租户容
器和不可信程式驱執行。
它不酒合需要大量傅接装置权缀、完整桌面国形或善版作案系统的瑞境。

## 5.离用容器

Docker、containerd、CRI-O、Podman、runc 和 crun 属於遗一生感。
客器共享主機核心,建立速度快、密度亮,映像與CI/CD生感成烈。它通合可信内部服務、微服
强登别抗和 Kubernetes 工作负致
客器的安全遍界依观主碳核心。-privilcgod、主機Docker Socket、根目综置、急险
capabilities和装量直通都可能削器隔醒。

## 6.系统容器

LXC、LXD、Incus、Systemd-nspawn 和 OpenVZ 亚接近 “鞋量 Linux 系。
系接容器可以软行完整init、多圈服膀和报近傅统主機的便用禮壁,但仍共享主楼核心。
ProxmoxVE使用LXC提供系統客器。它道合DN5、整控、代理、内部股移和低国险基磁酸施,不
逾合作為强隔随的不可信多租户遍界。

## 7.使用者空間核心网系统呼叫涉霜

gVisor以使用者空周应用核心操藏大量Linux系糖呼叫,降低工作负显直接接解主權核心的程
度。
它可以透遇runsc 整合 Docker、containerd 和 Kubernetes,在一般容器與完整 VM 之間
提供另一程安全取拾。
限制主要束白系统呼叫、榕案系统、期路與除相容性。部分工作典最含出斑明效能差翼。

## 8.VH隔雌容器

KataContainers 把 OCI睿器放入理量虚授機器中行。
上需仍保留Kubernetes、CRI和容器映像险,底唇则使用蜀立Guest核心它逾合多租户
Kubernetes、CI 机行器、第三方外挂翼 AI Agent 沙箱。
代债是架梳更夜瓣,期路、存、整控和故障抄警需要同時理解容器奥VH

## 9. Unikernel 奥 Library 0S

Unikraft、Nanos、Mirage0S 和 IncLude0S 等專案,誉就把感用实最小作藏系统能力编罐成單

## 一肤像。

这方案可以降低敏勤時間和系统體。也能缩小部分攻聚面,但POSIX相容性、驱勤、除、人
才和工具生攀不如LinuxVH或容器成熟

## 10. WebAssenbly

Wasmtime、Wasmer、WasmEdge、WANR 和 Wasm Workers Server 等执行時,把愿用限制在能
力填向的沙箱中。
Wasm造合函式、外排、遗缘谨算和可重新编挥的小型服移。敏动速度舆可移植性通常较好,但不能直
提联代所有Linux客器。
现有癌用如果依到完整POSIX、任意系辨呼叫、核心极组或特殊装置,移植成本可能很高。

## 11.API相容奥二进位翻麟

W1ne、Protan、Darling、WSL1 等资供作繁系睛 API 相容: QEMU User、FEX Box54 和
Rosetta2等解决CPU指令集差黑
造知接術的目福不是注立完整虚凝效疆,而是续特定融用在不同作案系统或CPU禁模上积行。

## 12.密虚凝模器奥碳密容器

AND SEV-SNP、 Intel TDX, Arn CCA, IBN Secure Execut1on, 以及 Conf1dential
Containers等專至,试国在雾端管理員或主機软整不完全可信時保摇工作负显紀恒體。
楼密通算需要同时虚理速端船明、映像测量、金输理放、别赠、I/0和供庭经。
记懂赠加密不等於完整安全。Do5、倒通道、结膜股定奥癌用漏润仍然存在。

## 13.孵想分割與安全關键虚摄化

ACRN、Ja1thouse、Ba0、seL4和Muen 主要面向嵌入式、覃藏、工繁控剧、即时系統和湛合
偿等级。
這额方案重视確定性、耐感資添分配和可脑照性,通常不追求公有营式的動娠超震况大规模通用管理。
主流阳源專案的定位
虚换化生馨中最容易出现的周题,是把管理工具、敦行时和核心能力視为同频產品。
Hypervisor、VMH 奥虚摄機器管理

- KVM&#58;Linux 核心硬體虚摄化 API.

- QEMU:全系统模摄器奥通用VHH

- Xen:獨立 Hypervisor,具有 PV、PVH 和 HVH 生態。

- bhyve: FreeBSD Hypervisor.

- Firecracker:面向震端工作负霸的辅赠KVM VM

- CLoud Hypervisor&#58;Rust 编离的现代善端 VHH

- Crosvm: Chrome0S 奥 Android 生服中的 Rust VNN

- Libvirt:毓一管理 QEMU、KVM、Xen、LXC、bhyve 等後端,本身不是 Hypervisor。

- Proxmox VE:整合KVM/QEMU、LXC、壹集、存、霸路和管理介面。

- OpenStack:大规模IaaS 控制面,底唇通常仍使用KVM/QEMU、Ceph 和 Open

v5witch,
容群购OCI生感

- Moby/Docker Engine:容器API、映像、翻路與生命遇期管理。

- containerd:客器生命调期與映像管理.

- CRI-O:面向Kubernetes CRI 的容器行時。

- runc&#58;OCI参考低唇熟行時。

- crun&#58;C語言實现的OCI執行時,支援cgroups v2與Wasn整合。

- Podman: Daemonless 容鹏引章

- LXC&#58;Linux 系统客器轨行畴。

- Incus:管理系容器與虚概器。

爱璃雕容器典沙箱

- Kata Containers:客器介面加量VM,

- gVisor:使用者空間鹰用核心。

- Firecracker: MicroVM 敦行。

- KubeVirt:在Kubernetes 中管理虚摄機据。

.ConfidentialContainers:楼密 VM、通端粗明和客器工作流程整合。
编排工具不是虚凝化核心
Kubernetes、Nomad、OpenStack,Proxmox VE、vCenter 和 Libvirt 郡主要位岭管理或编
排照。
這些平台决定工作负鼓放在趣程、便用多少資意、如何逗综和如何恢痘,但底層仍然需要KVM、
QENU、runc、LXC、Ceph.Linux Bridge 等元件完成實账执行。

## 二、Proxmox的產品定位與底層架横

ProxmOX是一组开源基碳施座品,而不只是單一虚提化收體
【图二&#58;Proxmox 品购技術张】

Proxnox Virtual Environment
Proxmox VE,通需离稿 PVE,是核心虚凝化平台。
主要能力包括:

- KVM/QEMU虚摄碳器:

- LXC系统容器;

- 多的慰据售;

- 高可用管理;

- ZFS, Ceph, LVM-thin, NFS. iSCSI 等存;

- Linux Bridge, VLAN, Bond. Open vSwitch 和 SDN;

- 防火糖、RBAC, API Token, LDAP, AD、OIDC 和 MFA;

- Web UI、REST API、 CLI 和行端管理。

PVE 探用AGPLv3,有打图也不會镇定蒸案、HA 或通移功能。付资订用主要提供 Enterprise
Repository、技術支握和版移等级。
Proxmox Backup Server
Proxmox Backup 5erver,開 PBS,是蜀立的催份平台。
它提供:

- 增量偏份;

- 跨情份去重;

- 用户端加密:

- 确份验铅;

- 适端同步:

- Prune Garbage Collection;

- 磁带储份:

- 榴案级恢摄:

- PVE VM 奥 LXC深度整合;

- 一般Linux主概的榴案兴医端装置備份:

- PBS4.2中的S3 相容物件個存後端。

PBS不糖只是安装在同一PVE主模上的另一他VK,然後把瓷科放回同一继碰强。份付胀器、
偷份介算和生毫盖集需要故险域隔。
Proxmox Datacenter Manager
Proxmox Datacenter Manager,简稻 PDM,用於管理多個握立 PVE 蓄里 PBS.
它提供跨站贴检视、操作和省漆管理,但目前仍虚龄快逼摘充段,不能直接视为vCenter或
OpenStack的完全等價替代品。
Proxmox Hail Gateway
Proxmox Hai1 GatewBy,随辑 PMG,是蜀立的部件安全道器,提供 SMTP 代理、垃级郵件通
滤、ClamAV、SpamAssassin,隔随氢和都件遗醛。
PNG履於 ProXmoX 官方商品線,但不依输 PVE,也不是虚化核心元件。
Proxmox offline Mirror
OffLine Mirror 用龄把 PVE、PBS、PMG 和 Debian 敢照套件座带人隔路。
它通合工掌纲路、内部安全區、無外資料中心和其他受控更新境境。螺訂图金输需要單强膜算。
PVE的底技衔榜
PVE的核心亚不是一個封谢照盒。大部分能力都能对感到具疆的上游技術。
针算

- Debian GNU/Linux:使用者空間购教霍塞件基碟

- Proxmox Linux Kernel: 包含 KVM、ZFS、 Ceph. VFIO 等所需支据。

- KVM&#58;CPU與記像體硬體虚摄化。

- QEMU&#58;VM装置模型则行程。

- LXC&#58;Linux 系统容器。

- cgroups V2&#58;CPu、記爆锥和 I/D 資源控制

Guest装置與工具

- OVMF/UEFI:现代 VK 新耀

- Se8BI0S:傅统 BIOS.

- Virtio Block,SCSI,Net,Balloon:高效能半虚提化置。

- QEMU Guest Agent:取得 Guest IP、撤機棺案系統深结

- cloud-init: Linux VM首次数投定。

- Cloudbase-Init&#58;Windaws 自勐化初始化.

- virtio-win: Windows Virtio 显勤度 Guest Agent,

- SPICE、noVNC、xterm.js:图形翼终谱主控台。

集贝高可用

- Corosync:盖集成員奥quorun 通讯

- pmxcfs: 同步/etc/pve 锐定。

- pve-ha-crm: 器集级 HA 决策

- QDevice:偶数暂贴或特定托下的额外投票。

- Watchdogfencing:避免故障前黏继绩存取共享資源。

HA 不是rVM 白動重战:这磨前單。它依可量的酸集期路、quorun、fencing、共享或可物
存。以及经退测试的故障虚理流程。
两前點集尤其需要理解quorun,加人QDevice可以改善投票條件。但不能修復不锡定的網路或
錯联的故源城设計。
PVE的管理工具
PVE Web UI 覆整大部分日常工作,但CLI 和 API對白融化、故障等警與批次操作更重要。
常用命令包括:

- qn:管理QENU/KVH虚数概:

- pct:管理LXC 客器:

- pvesh:截本糖呼叫 PVE REST API;

- pwesn:管理健存:

- pvecn:管理靠货、贴和quorun:

- ha-nanager: 管湿 HA 冀源:

- pWCSr:首理估存指表;

- Vzdunp:正立VW具CT 清龄:

- qnrestore:恢德得施 VH 菊份:

- pwean:管理 LXC App Liance 模板:

- PeLn:管理快月售、角色、ACL 和Token:

- pweceph: 品著臀管理 Ceph:

- pwenode: 管理师黏任鸦冀逐恒;

- pwereport:收集工機,富焦,存套润路除疆直品。

PVE 逾提供完签 REST API.Web UI 中的多数藻作都能對糖到 API 路径,API V1ewer 可J以直
接查旗多数和回傅结横。

## 三、Proxmox的部署、運舆周生態

髓存、鼠路、借份舆湿移
Proxmox VE 的髓存湿握非常腐,但不同後端的能力差具明。
本機留存
directory
最魔單的榴案留存,可放置qCOwZ、ISO、模板和傅純需份。通合小型部著,但共享则高可用能力取
决於底檔案系统。
LVM-thin
提供精置懂、快照和握限,通合本機医境髓存。管理單,但不是共享髓存。
ZFS
提供校验、墨瘤、快照、装、RAIDZ和M1rror.它通合单丽贴與本模存握装,也常見於家庭實
验室和中小型部著。
ZFS 需要合理的记像體、磁直通和酸障設計。硬體RAID上再建立ZFS,通常害削弱ZFS對實
除磁孩状能的判断。
隐碰状感的判断。
共享储存
NFS
部署触單,逾合ISO、模板、借份和一般VK存。效能实可罪性取决於 NAS、锡路和同步离入策
略。
iSCSI
提供区块存,常具SAN、LVM或廊商外排结合。需要正链感理nultipath.额定和快照能力。
Ceph
Ceph 是 PVE原生整合最深入的分做式储存方案之一。可以提供 RBD 医烤存购 CephFS.
它逾合需要的點故障容忍、横向抽充具HCI的器集,但需要足狗数量的點、磁键和低延還钢路。三
瓷源紧强的小主概加單一千光细路,通常不能代表合理的Ceph生座架。

## 第三方警存

PVE 生患中遗包括:

- LINSTOR + DRBD:

- StorPool;

- Blockbridge;

- StarWind;

- TrueNAS、 Synology、 QNAP 等 NFS/iSCSI 装置;

- 各频 SAN NVMe/TCP 整合。

探用第三方外排前,需要確 PVE 主版本相容性、快照、線上移、HAfencing、借份支援和
商页任遗界。
朝路、SDN奥防火
PVE 基磷网路通常由 Linux Bridge, VLAN-aware Bridge 和 Linux Bonding 组成,
Open vSwitch 逾合需要OVS、OpenFLow或拖藏虚摄交指的晚,但會增加维通拖蕴度。
PVE SDN 支援:

- Simple Zone;

- VLAN;

- QinQ;

- VXLAN;

- EVPN;

- FRR/BGP:

- 内建IPAM;

- phpIPAM NetBox IPAM 外排;

- PowerDNS;

- DHCP/DNSMasq;

- WireGuard Fabric,

PVE 防火猫可以在资料中心、的融和VM/CT多眉套用规剧
OPNsense、pfSense、Vy0S 和 OpenWrt 也常以 VH 形式部署,作為路由器、防火或 VPN
同道器。
如果虚凝防火独使用PCI期路卡直通,需要预先設計主機失联、VM故動顺序和故障恢復路径。管理
期路完全依單一防火糟VHM,會形成明的循環依。
催份舆炎整恢復
PVE 内建vzdunp 可以把 VN 和 CT 储份到 Directory、NFS 或 CIFS 等横案健存。
它逾合基碰完整储份。但不具做PBS的跨确份去里、验馆、還端同步和短粒度资料管理能力。
校完整的Proxnox情份架横通常包括:
PVE生密集
强立 PBS
—定期 verify
Prune 翼 Garbage Collection
透巢 PBS 同步
整综或不可觉副本
一
磁带或S3 相容物件储存
复制
商集借份生零湿包括 Veeam,NAKIVo、Vinchin、Storware 和 Bacula。
不同產品對VM、LXC、愿用一致性、PVE 最集设定、ACL、SDN和 HA设定的支缓花固不同,不能
只璀超支援Proxmox:使視为完盛保强
偏份癌遵循 3-2-1-1-8 原期:

- 3份资料;

2种不同介算;
1份震地:

- 1份整级、不可或隔;

- 0個未經验湿的恢復锚识。

典正的验输不是殖储份任题示成功。而是定期演触整量VM、一棉案、资料康、PVE曾贴重
装、PBS重建和站黏级恢復。
通移到Proxnox
常见来源包括 VMware ESXiHyper-V、其他KVM/Libvirt 平台、VirtualBox、實體 Linux
主糖和普源Appliance,
可用工具具路径包括:

- PVE Import Wizard;

- qn inportdisk:

,OVF/0VA 医入;

- qeu-ing convert;

- Clonezilla;

- virt-v2v;

- Vec8m等商案遭移或恢復工具;

- 医用屠重新部署。

逼移不能只感理磁础格式,遗需要检查:

- BIOS 或 UEFI;

- MBR 或 GPT;

- Virtio 显始;

- Windows 敏勤模式;

- 闵路介面名稻;

- IP、DNS 和防火糖;

- Guest Agent;

- 橙稀额定:

- 整控具備份:

- 回覆至原平台的方案。

健系统需要先建立测试批次,不能直接把第一次聘换富作正式切换。
自勤化興 Kubernetes
PVE 官方提供 REST API、API Token、 pvesh 、cloud-init 和各類 CLI,

## 第三方自助化生主要包括:

Terraforn 奥 openTofu
( https :/github .con/bpg/terrafonm-provider-proxnox ) 。
它可以管理 VM、LXC.前贴、霍限、储存和部分 SDN 資源。生產使用愿镇定 Provider 版本,测
试PVE主版本升级,亚致能State中不包含不必费的敏感瓷料。
Ansible
conmunity.proxrox
( `https://docs.ansible.com/projects/ansible/latest/collections/community/pr`
oxmox/) Collection 可管理VM.LXC、盖集资源和部分故定。
Ansible 迪合 Guest 初始化、批次操作和投定管理,但需要正确剩分 PVE API 概跟典 Guest
内部管理權限。
Packer
HashiCorp Packer Proxmox Plugin
( https : //developer.hashicorp com/packer/1ntegrat:1ons/hash1corp/proxmox )
可建立可重癌的VH模板。
常見流程是:
Packer 建立基建肤像
cloud-init 初始化
→ Terrafonm 建立 vH

- Ansible 完成跟定

重控具增份血数粒用
复制
API SDK
常見用户端包括:

- Proxmoxer: Python;

- go-proxmox: Go:

- Cors1nvest: PowerShell;

- 各 TypeScript、Java 和 Rust 社群 SDK

APISDK不是官方支援遍界的一部分。相客性仍以PVE APIViewer和實账版本测试為单
Proxnox 臭 Kubernetes 的低
PVE 可以承鞭 Kubernetes,但 PVE 本身不是 Kubernetes 行薇。
最常見的架横是在 PVE 上建立多VM,再在VM中部署 Kubernetes。福方式的隔、核心相
客性和升级遍界最清暖。
在 LXC中独行Kubernetes 可以降低部分资漆,但鲁遇到核心能力、巢状cgroups、
AppArmor、mount、網路和健存相容周题,不查合作益预投生產方案。
相额生感包括:

- Talos Linux;

- Flatcar Container Linux;

- Ubuntu, Deblan, Rocky Linux;

- kubeadm, K3s, RKE2;

- Cluster API Pravider Proxmox,常見宽明為 CAPNOX;

- Proxmox CSI Plugin;

- Proxmox Cloud ControlLer Manager;

- KubeVirt.

CSI、 CCM 和 Cluster API Prov1der 多为社群專案。 升级 PVE、 Kubernetes 或 Prov1der
前,需要验报API、筋贴拓探、磁础逻移和故险虚理。
不建播直报在 PVE 主碳安装Kubernetes、Docker 或一般業服務。PVE 主機应主要承握
Hypervisor、存和货管理脂景。
监控、安全奥周遗生娠
PVE内建任将日肱、系统日、資游图表、董集状和通知。
外部整控常見遇授包括:

- Prometheus PVE Exporter;

- Grafana:

- Zabb1x Proxmox VE by HTTP;

- InfluxDB:

- Graphite;

- Checkmk;

- Netdata;

- Telegraf;

- node_exporter:

- Ceph Dashboard,

日赫和安全分析可以使用:

- rsyslog 或 syslog-ng:

- Loki;

- Elastic Stack;

- Wazuh;

- aud1td,

安全基線至少包括:

- 管理面使用獨立VLAN或钢路:

- 限制 8886、SSH、Corosync、Ceph 和储存路的存取;

- 用MFA;

- API Token 探用小權限;

- 资免日常使用root;

- 定期更新PVE、核心、微碼和韧體;

- 便用 ACNE或受控 PKI 管理 TLS潜;

- 保/etc/pve、借份加密金端和 PBS權限:

- 到第三方剧本Provider 积行程式础稽核;

- 定期利松恢瘦興密集故障。

PVE防火精、MFA和加密借份都不能替代管理面網路理能奥醛限治理。
GPU、PCIe、VDI 奥速端存取
PVE支援常見的硬加通路径:

- VFIO PCI Passthrough;

- SR-I0V:

- NVIDIA vGPU;

- Intel iGPU;

- AMD GPU;

- USB, HBA、 NIC 和 NVMe 直通,

装置直通可以接近原生效能,但鲁限制续上遵移,亚增加 IOMMU Group、韧、驱动、Reset Bug
和授權管理福注度。
VDI闵速端鹰用生据包括:

- SPICE;

- RDP;

- Apache Guacamole;

- Kasm Workspaces:

- UDS Enterprise;

- Leostream:

- Parsec;

- Sunshine/Moonlight.

Proxmox VE 可以承额桌面VM,但不是完整的企繁VDI Broker。大规模桌面池、使用者設定、题
用缝布、GPU排程和还级代理通常需要额外產品。
社群本具第三方工具
Proxmox生馨中最知名的社群工具之一是 Proxmox VE Hel.per-Scr1pts
(https : //github . con/community-scripts/ProxmoxVE )
它能快速建立各熟LXC和底用環境,通合图人置验、PoC和非翻键眼孩。
凰验也很直接:

- 图本經常以root 在 PVE 主操执行;

,不同愿用本的品質和维握状不一致;

- PVE主版本升级可能造成相容限题:

- 快速安装不代表具借借份、整控、安全和退出方案。

生毫竭境需要固定commit、阅通原始碼、立内部映像、限制细路测试恢衡。
同爆的原则也逾用於 Terraforn Provider、AnsibLe Role、Exporter、CSI、鳞存外排和非
官方手操用户端,
源不等龄Proxmax官方支振;要案活强:也不等的具偏企 SLA

## 四、場景選型與部署建

工作负显愿先按照核心需求,信任遗界、相容性和装置需求分,再决定使用VM、一般容器、沙箱、
MicroVM 或其他执行方式
【三:虚提化技術遗型流程】

通用Linux或Windows伺服器
逾合使用 KVN/QENU VM,
原因是Guest 相容性高、隔摊遥界清晰、借份與還移成熟,PVE、Libvirt、OpenStack.
Hyper-V和 VMare 都属於常見管理退挥。
可信内部微服务
逾合使用 containerd、CRI-0、Docker 或 Podnan, 加上 runc 或 crun,
如果需要大规模编排。可以使用Kubernetes。安全性主要依主糖核心、映像供愿录、概限和翊路
策略。
不可信程式碼、第三方外播或 AI Agent

## 一般容器不愿作為唯一隔雕退界。

可以考:

- Firecracker:

- Kata Containers;

- gVisor;

- 狮立 KVN/QEMU VM;

- 密容器。

具體进取决於LinuxABI、联置需求、敏動诗围、密度和威骨模型。
跨CPU莱
完整作藏系统使用QEMUTCG.
量一程式可以考虚QENU User、FEX 或Box64.若能重新编耀,原生多架柄映像通常更输。
Serverless 奥Scale-to-zero
Firecracker、 Cloud Hypervisor、 Kata, Kasm 和 Unikernel 都可董通用。
需要實洲的不是單純「VM故動時周:,而是缺像下、解墨、细路、存、离用初始化、JIT和第

## 一個幅求的完整延還

家庭實验室
单静贴 PVE 加 ZFS Mirror 是常见起贴.
偷份宣使用另一壹装置上的PBS,或至少放在蜀立故障域。Docker终一般应用服故在VK或
LXC中,不直接堆叠在PVE 主概
小型企嘴
常见架精是三筋贴 PVE、强立 PBS、10GbE或更高频寞,以及 ZFS、NFS/iSCSI 或绑遇客量
的Ceph,
遗需要鉴控、集中日结、UPS、翼地做价、經限管理具定期恢物演貌。
多站黏奥中大型玻境
需要考威:

- 多個编立 PVE普集;

- PDM 统一橡视;

- 跨站贴 PBS同步;

- Ceph、企蒙 SAN 或第三方分敏式储存;

- CMDB、IaC、SIEM 和统一身分管理:

- 升额批次舆回復方案;

- 明磷的支提合同购责任遍界

Proxnox的侵贴與限制
主要優贴

- 接心功能拥源,没有用訂圈锁定 HA、遭移和露果;

- KVM/QEMU 翼LXC整合完整:

- Web UI、API 和 CLI 覆露面质;

- ZFS、Ceph、NFS、iSCSI 等继存项富;

- PBS的借份整合度高:

- 單贴到中型著集都能探用;

- 硬體需求相對通用:

- 社群、自動化和第三方整合快速成长。

主要限制

- 多租户公有要能力不等同於OpenStack;

- 大规权企管理成熟废仍需结合PDH的登展解估;

- Ceph,SDN、HA 和 GPU 直通都需要實察 Linux 维通能力;

- LXC不是强胱 VM;

- 第三方 Provider、CSI、Exporter 和胞本不在官方支援逸界内:

- 虚凝防火精、VDI、CNDB、SIEM 和完盛ITSH 仍需外部系统;

- 董集智贴不能愈跨高延還站贴相应一Corosync盖集:

- 没有合理硬髓、期路與偏份说计時,期源接耀不會自動降低整證风险。

部署前的杆估清單

- CPU是否支援虚授化具IOMM;

- NUMA、記糖疆、Huge Pages 和超震策路;

- Windows、Linux、 BSD 或特殊 Guest 栏客性;

- GPU, HBA、 NIC 和 USB 直通薇求,

集

- 静黏影量quorun;

- 節點数量贝quorum;

- Corosync延邂、丢包和獨立键路;

- fencing Watchdog:

- 故障節點恢復流程;

- 升级與重新動顺序。

存

- IOPS、吞吐、延和容量;

- 本機或共享;

- ZFS、Ceph、SAN 或 NAS;

- 快照、複裂與線上逻移;

- 故障域和重建時間;

- 寫入快取、UPS和资料完整性。

網路

- 管理、Corosync、储存、遵移和Guest鋼路是否分離;

- VLAN、Bond、MTU 和 LACP;

- SDN、VXLAN、EVPN 和 IPAM;

- 防火與速端管理;

- 管理面失聯時的恢復路。

備份

- PBS是否位於獨立故障域;

- 是否有翼地、離線或不可副本;

- 加密金如何保管:

- Verify、Prune 和 Garbage Collection 排程;

- VM、檔案、资料座和整站恢復是否經過演。

自動化舆安全

- APIToken是否探用最小權限;

- TerraformState是否加密舆受控;

- Provider、Collection 和本是否定版本;

- 是否具備测試環境;

- 第三方原始碼和映像是否經過稽核;

- 日、监控、告警和SIEM是否覆蓄管理面。

結語
QEMU、KVM、Docker 和ProxmoX之間不存在簡單的替代係。
KVM提供核心虚凝化能力,QEMU建立與執行虚凝機器,Docker管理共享核心的容器,Proxmox
VE则把KVM/QEMU、LXC、集、储存、鋼路和管理工具整合成基硬設施平台。
容器、MicroVM、gVisor、Kata、Wasm和機密谨算也不是線性升级關係。每一種方案都在隔龙強
度、Guest相容性、動速度、資源密度、装置能力和维通成本之間作出不同取拾。
合理的避型顺序應當是:

## 1.定義工作負載贝威育模型;

## 2.定是否需要揭立核心;

## 3.定Guest作業系统、CPU架和装置需求;

## 4.比较備份、遭移、监控和故障恢復能力;

## 5.验開源專案的状態與支援遗界:

## 6.在實硬體和網路上完成基測試;

## 7.最後决定探用VM、容器、沙箱、MicroVM、Wasm或混合架。

Proxmox的位置也因此得清晰:它不是所有虚凝化技術的替代品,而是一套以LinuX闻源技術為
基、偏向實際资料中心與私有基碰設施管理的整合平台。
参考資料

- Proxmox官方產品與版本(`https://www.proxmox.com/en/home`)

- Proxmox VE Administration Guide (`https://pve.proxmox.com/pve-docs/pve-`

admin-guide.pdf )

- Proxmox VE API Viewer (`https://pve.proxmox.com/pve-docs/api-viewer/`)

- Proxmox官方原始碼(`https://git.proxmox.com/`)

- Proxmox Datacenter Manager 文件(`https://pdm.proxmox.com/docs/`)

- QEMU System Emulation

(https : //www.qemu.org/docs/master/system/index.html)

- Linux KVM 文件

(https : //www.kernel.org/doc/html/latest/virt/kvm/index.html )

- OCI Runtime Specification (`https://github.com/opencontainers/runtime-`

spec)

- containerd Runtime v2 (`https://containerd.io/docs/2.3/runtime-v2/`)

- Firecracker Architecture (`https://github.com/firecracker-`

microvm/firecracker/blob/main/docs/design.md )

- Kata Containers Architecture (`https://github.com/kata-containers/kata-`

containers/blob/main/docs/design/architecture/README.md )

- gVisor Security Model

(`https://gvisor.dev/docs/architecture_guide/security/`)

- Confidential Containers

(`https://confidentialcontainers.org/docs/architecture/design-`
overview/)

- Ansible community.proxmox

(`https://docs.ansible.com/projects/ansible/latest/collections/community`
/proxmox/)

- Terraform/0penTofu bpg Provider (`https://github.com/bpg/terraform-`

provider-proxmox)

- Packer Proxmox Plugin

(`https://developer.hashicorp.com/packer/integrations/hashicorp/proxmox`
)

## 原始排版图

> 原始导出图超过单张 WebP 的尺寸上限，以下图片按从上到下的顺序连续保存。
![QEMU、KVM、Docker 與 Proxmox：一篇梳理虛擬化技術與 Proxmox 生態：微信公众号导出原始排版图（第 1 段，共 2 段）](/img/wechat/2026-07-27-qemu-kvm-docker-與-proxmox-一篇梳理虛擬化技術與-proxmox-生態-2247486104/article-01.webp)
![QEMU、KVM、Docker 與 Proxmox：一篇梳理虛擬化技術與 Proxmox 生態：微信公众号导出原始排版图（第 2 段，共 2 段）](/img/wechat/2026-07-27-qemu-kvm-docker-與-proxmox-一篇梳理虛擬化技術與-proxmox-生態-2247486104/article-02.webp)
