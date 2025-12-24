import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

function LabsContent() {
  const labs = [
    // External Services
    {
      category: 'External Services',
      color: '#10b981',
      items: [
        {
          id: 'polymarket',
          title: 'PolyScan',
          description: 'Polymarket analytics and scanning tools',
          url: 'https://polymarket.w0x7ce.eu/',
          icon: '📊',
          tags: ['Analytics', 'Data'],
          external: true
        },
        {
          id: 'n8n',
          title: 'n8n',
          description: 'Workflow automation platform',
          url: 'https://n8n.w0x7ce.eu/',
          icon: '🔄',
          tags: ['Automation', 'Workflow'],
          external: true
        },
        {
          id: 'docker',
          title: 'Docker Registry',
          description: 'Docker Hub mirror and container registry',
          url: 'https://docker.w0x7ce.eu/',
          icon: '🐳',
          tags: ['Docker', 'Containers'],
          external: true
        },
        {
          id: 'pypi',
          title: 'PyPI Mirror',
          description: 'Python Package Index mirror for faster downloads',
          url: 'https://pypi.w0x7ce.eu/',
          icon: '📦',
          tags: ['Python', 'Packages'],
          external: true
        },
        {
          id: 'mirrors',
          title: 'Linux Mirrors',
          description: 'Linux distribution mirrors (Ubuntu, CentOS, etc.)',
          url: 'https://mirrors.w0x7ce.eu/',
          icon: '🪞',
          tags: ['Linux', 'Mirrors'],
          external: true
        },
        {
          id: 'github',
          title: 'GitHub Proxy',
          description: 'GitHub acceleration proxy for faster clone and download',
          url: 'https://github.w0x7ce.eu/',
          icon: '🐙',
          tags: ['GitHub', 'Git'],
          external: true
        },
        {
          id: 'proxy',
          title: 'Universal Proxy',
          description: 'Universal file proxy and downloader',
          url: 'https://proxy.w0x7ce.eu/',
          icon: '🌐',
          tags: ['Proxy', 'Download'],
          external: true
        }
      ]
    }
  ];

  const styles = {
    page: {
      background: '#f8fafc',
      color: '#1e293b',
      minHeight: 'calc(100vh - var(--ifm-navbar-height) - var(--ifm-footer-height))',
      padding: '60px 20px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '60px',
    },
    title: {
      fontSize: '3rem',
      fontWeight: 800,
      letterSpacing: '-2px',
      marginBottom: '15px',
      color: '#0f172a',
    },
    subtitle: {
      fontSize: '1.15rem',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.6,
    },
    section: {
      marginBottom: '50px',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#0f172a',
    },
    sectionTitleBar: {
      height: '4px',
      width: '40px',
      borderRadius: '2px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
    },
    card: {
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'all 0.2s ease',
      display: 'block',
      position: 'relative',
      overflow: 'hidden',
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.1)',
      borderColor: 'var(--color)',
    },
    cardIcon: {
      fontSize: '2rem',
      marginBottom: '12px',
    },
    cardTitle: {
      fontSize: '1.15rem',
      fontWeight: 700,
      marginBottom: '8px',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    externalIcon: {
      fontSize: '0.8rem',
      opacity: 0.5,
    },
    cardDesc: {
      fontSize: '0.9rem',
      color: '#64748b',
      lineHeight: 1.5,
      marginBottom: '16px',
    },
    tags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    tag: {
      fontSize: '0.75rem',
      padding: '4px 10px',
      borderRadius: '6px',
      background: '#f1f5f9',
      color: '#475569',
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Labs</h1>
          <p style={styles.subtitle}>
            Internal research projects and external services
          </p>
        </header>

        {labs.map((section) => (
          <section key={section.category} style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <div style={{ ...styles.sectionTitleBar, background: section.color }}></div>
              {section.category}
            </h2>
            <div style={styles.grid}>
              {section.items.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  style={{ ...styles.card, '--color': section.color }}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.cardHover);
                    e.currentTarget.style.borderColor = section.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={styles.cardIcon}>{item.icon}</div>
                  <div style={styles.cardTitle}>
                    {item.title}
                    {item.external && <span style={styles.externalIcon}>↗</span>}
                  </div>
                  <p style={styles.cardDesc}>{item.description}</p>
                  <div style={styles.tags}>
                    {item.tags.map((tag) => (
                      <span key={tag} style={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function Labs() {
  return (
    <Layout
      title="Labs | w0x7ce"
      description="Internal research projects and external services"
    >
      <BrowserOnly>
        {() => <LabsContent />}
      </BrowserOnly>
    </Layout>
  );
}
