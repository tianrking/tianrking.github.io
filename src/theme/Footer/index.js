import { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import styles from './footer.module.css';

const TypewriterText = ({ texts, speed = 100, delay = 2000 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentText = texts[currentTextIndex];

      if (!isDeleting) {
        if (currentCharIndex < currentText.length) {
          setCurrentCharIndex(currentCharIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (currentCharIndex > 0) {
          setCurrentCharIndex(currentCharIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentTextIndex, currentCharIndex, isDeleting, texts, speed, delay]);

  return (
    <span className={styles.typewriter}>
      {texts[currentTextIndex].substring(0, currentCharIndex)}
      <span className={styles.cursor}>|</span>
    </span>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const typewriterTexts = [
    'Welcome to my garden 🌵',
    'Sharing knowledge daily ✨',
    'Building the future 🛠️',
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          {/* Typewriter Title */}
          <div className={styles.typewriterSection}>
            <h3 className={styles.mainTitle}>
              <TypewriterText texts={typewriterTexts} />
            </h3>
          </div>

          {/* Links Section */}
          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h4 className={styles.sectionTitle}>Content</h4>
              <ul className={styles.linkList}>
                <li>
                  <Link to="/docs/intro" className={styles.footerLink}>
                    <span>📖</span>
                    Tutorial
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className={styles.footerLink}>
                    <span>✍️</span>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h4 className={styles.sectionTitle}>Projects</h4>
              <ul className={styles.linkList}>
                <li>
                  <a href="https://github.com/tianrking" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
                    <span>🐙</span>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://github.com/tianrking/tianrking.github.io" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
                    <span>⭐</span>
                    Star on GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h4 className={styles.sectionTitle}>Connect</h4>
              <ul className={styles.linkList}>
                <li>
                  <Link to="/about" className={styles.footerLink}>
                    <span>👤</span>
                    About Me
                  </Link>
                </li>
                <li>
                  <a href={`mailto:contact@w0x7ce.eu`} className={styles.footerLink}>
                    <span>✉️</span>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <p>© {currentYear} w0x7ce. Crafted with 💜 in The Secret Garden</p>
            <p className={styles.credit}>Inspired by @meta</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
