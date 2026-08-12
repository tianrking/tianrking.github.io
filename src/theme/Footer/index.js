import Link from '@docusaurus/Link';
import styles from './footer.module.css';

const SITE_LINKS = [
  {label: '技術筆記', to: '/tutorial'},
  {label: '開發誌', to: '/blog'},
  {label: '專案', to: '/projects'},
  {label: '實驗場', to: '/labs'},
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.identity}>
          <Link className={styles.brand} to="/">w0x7ce</Link>
          <p>把做過、拆過與驗證過的系統寫下來。</p>
          <p className={styles.scope}>Embedded systems · Local AI · Infrastructure</p>
        </div>
        <nav className={styles.navigation} aria-label="頁尾導覽">
          {SITE_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>
        <div className={styles.external}>
          <a href="https://github.com/tianrking" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href="mailto:contact@w0x7ce.eu">Contact</a>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} w0x7ce</span>
        <span>Built with Docusaurus</span>
      </div>
    </footer>
  );
}
