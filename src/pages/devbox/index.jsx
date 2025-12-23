import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

function DevBoxContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Tool data
  const tools = {
    pypi: {
      title: "PyPI / PyTorch",
      color: "#ee4c2c",
      tabs: ["Quick Run", "Global Config", "PyTorch"],
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
      content: [
        `<div class="instruction">Temporary Install</div>
        <div class="code-wrap"><span class="comment"># Single install</span><br><pre class="code-pre"><span class="cmd">pip</span> install <span class="arg">numpy</span> -i https://pypi.w0x7ce.eu/simple</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>
        <a href="https://pypi.w0x7ce.eu" target="_blank" class="external-link">Go to Website &rarr;</a>`,

        `<div class="instruction">Global Configuration (Recommended)</div>
        <div class="code-wrap"><span class="comment"># Set as default source</span><br><pre class="code-pre"><span class="cmd">pip</span> config set global.index-url https://pypi.w0x7ce.eu/simple</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>`,

        `<div class="instruction">Install PyTorch (CUDA 11.8)</div>
        <div class="code-wrap"><span class="comment"># PyTorch acceleration</span><br><pre class="code-pre"><span class="cmd">pip</span> install torch torchvision --index-url https://pypi.w0x7ce.eu/pytorch/cu118</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>`
      ]
    },
    hf: {
      title: "Hugging Face",
      color: "#ffd21e",
      tabs: ["CLI", "Python", "HF Transfer"],
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"/><path d="M15 9h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm-6 0H8a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm3 4a3 3 0 0 0-3 3 .5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5 3 3 0 0 0-3-3Z"/></svg>',
      content: [
        `<div class="instruction">Hugging Face CLI</div>
        <div class="code-wrap"><span class="comment"># Set env and download</span><br><pre class="code-pre">export HF_ENDPOINT=https://hf.w0x7ce.eu<br><span class="cmd">huggingface-cli</span> download <span class="arg">meta-llama/Llama-2-7b-hf</span></pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>
        <a href="https://hf.w0x7ce.eu" target="_blank" class="external-link">Go to Website &rarr;</a>`,

        `<div class="instruction">Python Code</div>
        <div class="code-wrap"><pre class="code-pre">import os<br>os.environ["HF_ENDPOINT"] = "https://hf.w0x7ce.eu"<br><br>from huggingface_hub import snapshot_download<br>snapshot_download(repo_id="<span class="arg">gpt2</span>")</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>`,

        `<div class="instruction">High Speed (Multi-thread)</div>
        <div class="code-wrap"><span class="comment"># Enable hf_transfer</span><br><pre class="code-pre">pip install hf_transfer<br>export HF_HUB_ENABLE_HF_TRANSFER=1<br>export HF_ENDPOINT=https://hf.w0x7ce.eu</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>`
      ]
    },
    github: {
      title: "GitHub Proxy",
      color: "#2da44e",
      tabs: ["Git Clone", "Wget"],
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>',
      content: [
        `<div class="instruction">Clone Repository</div>
        <div class="code-wrap"><pre class="code-pre"><span class="cmd">git</span> clone https://github.w0x7ce.eu/<span class="arg">username/repo</span></pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>
        <a href="https://github.w0x7ce.eu" target="_blank" class="external-link">Go to Website &rarr;</a>`,

        `<div class="instruction">Download Release / Raw</div>
        <div class="code-wrap"><pre class="code-pre"><span class="cmd">wget</span> https://github.w0x7ce.eu/https://github.com/.../file.zip</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>`
      ]
    },
    docker: {
      title: "Docker Hub",
      color: "#0db7ed",
      tabs: ["Pull", "Daemon Config"],
      icon: '<svg viewBox="0 0 24 24"><path d="M2 13h2v2H2zm4 0h2v2H6zm-2-4h2v2H4zm4 0h2v2H8zm-2-4h2v2H6zm6 8h2v2h-2zm-2-4h2v2h-2zm4 0h2v2h-2zm2 4h2v2h-2zm-2-4h2v2h-2zm4 0h2v2h-2zm-2-4h2v2h-2zm-2-4h2v2h-2zm12 12h-2v4h-2v-4h-2v4h-2v-4h-2v4H2v-2h18v-2h2v4z"/></svg>',
      content: [
        `<div class="instruction">Direct Pull</div>
        <div class="code-wrap"><pre class="code-pre"><span class="cmd">docker</span> pull docker.w0x7ce.eu/library/<span class="arg">nginx:latest</span></pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>
        <a href="https://docker.w0x7ce.eu" target="_blank" class="external-link">Go to Website &rarr;</a>`,

        `<div class="instruction">/etc/docker/daemon.json</div>
        <div class="code-wrap"><pre class="code-pre">{<br>  "registry-mirrors": [<br>    "https://docker.w0x7ce.eu"<br>  ]<br>}</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>
        <div class="code-wrap"><span class="comment"># Restart Docker</span><br><pre class="code-pre">sudo systemctl daemon-reload && sudo systemctl restart docker</pre></div>`
      ]
    },
    mirrors: {
      title: "Linux Mirrors",
      color: "#8b5cf6",
      tabs: ["Ubuntu (APT)", "CentOS (YUM)"],
      icon: '<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>',
      content: [
        `<div class="instruction">/etc/apt/sources.list</div>
        <div class="code-wrap"><pre class="code-pre">deb https://mirrors.w0x7ce.eu/http://archive.ubuntu.com/ubuntu/ jammy main restricted</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>
        <a href="https://mirrors.w0x7ce.eu" target="_blank" class="external-link">Go to Website &rarr;</a>`,

        `<div class="instruction">/etc/yum.repos.d/xxx.repo</div>
        <div class="code-wrap"><pre class="code-pre">baseurl=https://mirrors.w0x7ce.eu/http://mirror.centos.org/centos/7/os/x86_64/</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>`
      ]
    },
    proxy: {
      title: "Universal Proxy",
      color: "#d946ef",
      tabs: ["Wget", "Curl"],
      icon: '<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>',
      content: [
        `<div class="instruction">Wget Download</div>
        <div class="code-wrap"><pre class="code-pre"><span class="cmd">wget</span> "https://proxy.w0x7ce.eu/https://example.com/file.zip"</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>
        <a href="https://proxy.w0x7ce.eu" target="_blank" class="external-link">Go to Website &rarr;</a>`,

        `<div class="instruction">Curl Download</div>
        <div class="code-wrap"><pre class="code-pre"><span class="cmd">curl</span> -L -O "https://proxy.w0x7ce.eu/https://example.com/file.zip"</pre><button class="modal-copy-btn" onclick="window.devboxCopy(this)">Copy</button></div>`
      ]
    }
  };

  const openModal = (key) => {
    setCurrentTool(tools[key]);
    setActiveTab(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTool(null);
  };

  const switchTab = (index) => {
    setActiveTab(index);
  };

  const copyText = (btn) => {
    const codeBlock = btn.previousElementSibling;
    const text = codeBlock.innerText;
    navigator.clipboard.writeText(text);
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = 'Copy';
    }, 1500);
  };

  useEffect(() => {
    // Make copy function globally available
    window.devboxCopy = copyText;

    // Particle effect
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, ps = [];
    const colors = ['#ee4c2c', '#ffd21e', '#2da44e', '#0db7ed', '#8b5cf6', '#d946ef'];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.onresize = resize;
    resize();

    for (let i = 0; i < 60; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        c: colors[i % 6]
      });
    }

    const run = () => {
      ctx.clearRect(0, 0, w, h);
      ps.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(run);
    };
    run();

    return () => {
      window.onresize = null;
      delete window.devboxCopy;
    };
  }, []);

  const cards = [
    {
      id: 'pypi',
      title: 'PyPI / Torch',
      desc: 'Python dependency packages and PyTorch large model acceleration with automatic CUDA version matching.',
      cmd: 'pip install ... -i ...',
      color: '#ee4c2c',
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>'
    },
    {
      id: 'hf',
      title: 'Hugging Face',
      desc: 'AI model weights and dataset acceleration with Token authentication and LFS large file transfer.',
      cmd: 'export HF_ENDPOINT=...',
      color: '#ffd21e',
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"/><path d="M15 9h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm-6 0H8a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm3 4a3 3 0 0 0-3 3 .5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5 3 3 0 0 0-3-3Z"/></svg>'
    },
    {
      id: 'github',
      title: 'GitHub Proxy',
      desc: 'Git Clone repository acceleration, Releases files and Raw file acceleration.',
      cmd: 'git clone https://...',
      color: '#2da44e',
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>'
    },
    {
      id: 'docker',
      title: 'Docker Hub',
      desc: 'Docker Hub, Quay, GCR, K8s container image acceleration, solving pull timeout issues.',
      cmd: 'docker pull ...',
      color: '#0db7ed',
      icon: '<svg viewBox="0 0 24 24"><path d="M2 13h2v2H2zm4 0h2v2H6zm-2-4h2v2H4zm4 0h2v2H8zm-2-4h2v2H6zm6 8h2v2h-2zm-2-4h2v2h-2zm4 0h2v2h-2zm2 4h2v2h-2zm-2-4h2v2h-2zm4 0h2v2h-2zm-2-4h2v2h-2zm-2-4h2v2h-2zm12 12h-2v4h-2v-4h-2v4h-2v-4h-2v4H2v-2h18v-2h2v4z"/></svg>'
    },
    {
      id: 'mirrors',
      title: 'Linux Mirrors',
      desc: 'APT (Ubuntu/Debian), YUM (CentOS), DNF system source acceleration.',
      cmd: '/etc/apt/sources.list',
      color: '#8b5cf6',
      icon: '<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>'
    },
    {
      id: 'proxy',
      title: 'File Proxy',
      desc: 'Universal file downloader, auto-fix filename, solve cross-domain and anti-hotlinking.',
      cmd: 'wget / curl -O ...',
      color: '#d946ef',
      icon: '<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>'
    }
  ];

  const styles = {
    page: {
      background: '#f8fafc',
      color: '#1e293b',
      minHeight: 'calc(100vh - var(--ifm-navbar-height) - var(--ifm-footer-height))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowX: 'hidden',
      position: 'relative',
    },
    canvasBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
    },
    header: {
      textAlign: 'center',
      padding: '60px 20px 40px',
      zIndex: 1,
    },
    logoBox: {
      width: '60px',
      height: '60px',
      background: '#0f172a',
      color: '#fff',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      fontWeight: 800,
      fontSize: '28px',
      boxShadow: '0 15px 35px -10px rgba(15, 23, 42, 0.3)',
      transform: 'rotate(-3deg)',
      transition: 'transform 0.3s',
    },
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      letterSpacing: '-1.5px',
      marginBottom: '15px',
      color: '#0f172a',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#475569',
      fontWeight: 400,
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.6,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      gap: '25px',
      width: '100%',
      maxWidth: '1100px',
      padding: '0 20px 60px',
      zIndex: 1,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(255,255,255,0.6)',
      borderRadius: '20px',
      padding: '28px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '250px',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '18px',
    },
    icon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
    },
    iconSvg: {
      width: '28px',
      height: '28px',
      fill: 'currentColor',
    },
    arrowIcon: {
      fontSize: '20px',
      color: '#cbd5e1',
      transition: 'all 0.3s',
    },
    title: {
      fontWeight: 800,
      fontSize: '1.25rem',
      marginBottom: '10px',
      letterSpacing: '-0.5px',
      color: '#1e293b',
    },
    desc: {
      fontSize: '0.95rem',
      color: '#475569',
      lineHeight: 1.6,
      flexGrow: 1,
      paddingBottom: '8px',
    },
    actionArea: {
      marginTop: 'auto',
      background: '#f1f5f9',
      borderRadius: '10px',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      opacity: 0,
      transform: 'translateY(15px)',
      transition: 'all 0.3s ease',
    },
    cmdPreview: {
      fontFamily: 'Consolas, monospace',
      fontSize: '0.8rem',
      color: '#475569',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '65%',
    },
    actionBtn: {
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      background: '#fff',
      padding: '5px 10px',
      borderRadius: '6px',
      border: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    modal: {
      background: '#fff',
      width: '100%',
      maxWidth: '700px',
      borderRadius: '20px',
      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '85vh',
    },
    modalHeader: {
      padding: '25px 30px',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalTitleBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    modalIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
    },
    modalIconSvg: {
      width: '22px',
      height: '22px',
      fill: 'currentColor',
    },
    modalTitle: {
      fontSize: '1.35rem',
      fontWeight: 800,
      color: '#0f172a',
    },
    closeBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'transparent',
    },
    tabs: {
      display: 'flex',
      padding: '0 30px',
      marginTop: '15px',
      gap: '8px',
      borderBottom: '1px solid #f1f5f9',
    },
    tabBtn: {
      padding: '10px 16px',
      background: 'none',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#64748b',
      cursor: 'pointer',
      position: 'relative',
      transition: 'color 0.2s',
    },
    tabBtnActive: {
      color: 'var(--color)',
    },
    modalBody: {
      padding: '30px',
      overflowY: 'auto',
      background: '#fafafa',
      flexGrow: 1,
    },
    tabContent: {
      animation: 'slideIn 0.3s ease',
    },
  };

  return (
    <div style={styles.page}>
      <canvas id="canvas-bg" style={styles.canvasBg}></canvas>

      <header style={styles.header}>
        <div style={styles.logoBox}>B</div>
        <h1 style={styles.h1}>Dev<span style={{ color: '#0f172a' }}>Box</span></h1>
        <p style={styles.subtitle}>Ultimate Accelerator Collection for Developers</p>
      </header>

      <div style={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={{ ...styles.card, '--color': card.color }}
            onClick={() => openModal(card.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 35px -10px rgba(0, 0, 0, 0.15)';
              e.currentTarget.querySelector('.devbox-arrow').style.opacity = '1';
              e.currentTarget.querySelector('.devbox-arrow').style.transform = 'translateX(4px)';
              e.currentTarget.querySelector('.devbox-action-area').style.opacity = '1';
              e.currentTarget.querySelector('.devbox-action-area').style.transform = 'translateY(0)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px -8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.querySelector('.devbox-arrow').style.opacity = '';
              e.currentTarget.querySelector('.devbox-arrow').style.transform = '';
              e.currentTarget.querySelector('.devbox-action-area').style.opacity = '0';
              e.currentTarget.querySelector('.devbox-action-area').style.transform = 'translateY(15px)';
            }}
          >
            <div style={styles.cardHeader}>
              <div style={{ ...styles.icon, color: card.color, backgroundColor: 'rgba(241, 245, 249, 0.8)' }}>
                <span dangerouslySetInnerHTML={{ __html: card.icon }} style={styles.iconSvg} />
              </div>
              <div style={{...styles.arrowIcon}} className="devbox-arrow">→</div>
            </div>
            <div style={styles.title}>{card.title}</div>
            <div style={styles.desc}>{card.desc}</div>
            <div style={styles.actionArea} className="devbox-action-area" onClick={(e) => e.stopPropagation()}>
              <div style={styles.cmdPreview}>{card.cmd}</div>
              <button
                style={{ ...styles.actionBtn, color: card.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(card.id);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && currentTool && (
        <div
          style={styles.modalOverlay}
          onClick={closeModal}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div style={styles.modalTitleBox}>
                <div style={{ ...styles.modalIcon, color: currentTool.color }}>
                  <span dangerouslySetInnerHTML={{ __html: currentTool.icon }} style={styles.modalIconSvg} />
                </div>
                <div style={styles.modalTitle}>{currentTool.title}</div>
              </div>
              <button
                style={styles.closeBtn}
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div style={styles.tabs}>
              {currentTool.tabs.map((tab, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.tabBtn,
                    ...(activeTab === i ? { ...styles.tabBtnActive, '--color': currentTool.color } : {})
                  }}
                  onClick={() => switchTab(i)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div style={styles.modalBody}>
              {currentTool.content.map((content, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.tabContent,
                    display: activeTab === i ? 'block' : 'none'
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DevBox() {
  return (
    <Layout
      title="DevBox | w0x7ce"
      description="Ultimate Accelerator Collection for Developers"
    >
      <BrowserOnly>
        {() => <DevBoxContent />}
      </BrowserOnly>
    </Layout>
  );
}
