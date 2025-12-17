import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.backgroundPattern}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.gardenIcon}>🌵</div>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>
            ✍️ Escribo, 💻 Comparto, 🌴 Vivo, 🔍 Exploro, 🎨 Creo, 💭 Pienso ✨
          </p>
          <p className={styles.heroDescription}>
            A multilingual technical documentation hub featuring practical guides for microcontroller development,
            embedded systems, Linux administration, programming languages, and containerization technologies.
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx("button button--primary button--lg", styles.primaryButton)}
              to="/tutorial">
              🌟 Explore The Garden
            </Link>
            <Link
              className={clsx("button button--outline button--lg", styles.secondaryButton)}
              to="/blog">
              📚 Read the Blog
            </Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>46+</div>
              <div className={styles.statLabel}>Technical Articles</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>4</div>
              <div className={styles.statLabel}>MCU Families</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>3</div>
              <div className={styles.statLabel}>Languages</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="The Secret Garden - Technical Documentation Hub">
      <HomepageHeader />
      <main className={styles.mainContent}>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
