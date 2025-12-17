import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'ESP32',
    icon: '📡',
    description: (
      <>
        Comprehensive guides for ESP-IDF 5.3 SDK, MCPWM usage, and wireless communication protocols.
        Everything you need to master ESP32 development.
      </>
    ),
    link: '/tags',
    color: '#8b5cf6'
  },
  {
    title: 'RP2040',
    icon: '⚡',
    description: (
      <>
        From UART interrupts to advanced PIO programming. Learn to harness the power of the RP2040
        microcontroller with practical examples.
      </>
    ),
    link: '/tags',
    color: '#ec4899'
  },
  {
    title: 'STM32',
    icon: '🔌',
    description: (
      <>
        CDC communication development and STM32CubeMX integration. Build robust embedded systems
        with ST's powerful microcontroller family.
      </>
    ),
    link: '/tags',
    color: '#3b82f6'
  },
  {
    title: 'Legacy Articles',
    icon: '📚',
    description: (
      <>
        46+ technical articles covering Linux, Docker, programming languages, data science, and more.
        Organized in 10 categories for easy discovery.
      </>
    ),
    link: '/tags',
    color: '#10b981'
  },
  {
    title: 'CN Series',
    icon: '🔧',
    description: (
      <>
        Bouffalo BL602/BL616/BL618 development guides and WinnerMicro XT-E804 board tutorials.
        Explore China's innovative microcontroller solutions.
      </>
    ),
    link: '/tags',
    color: '#f59e0b'
  },
  {
    title: 'Blog',
    icon: '✍️',
    description: (
      <>
        Technical insights, development tips, and hands-on tutorials. Stay updated with the latest
        in embedded systems and software development.
      </>
    ),
    link: '/tags',
    color: '#a78bfa'
  },
];

function Feature({Svg, title, description, link, icon, color}) {
  return (
    <div className={clsx('col col--4')} style={{ marginBottom: '2rem' }}>
      <a href={link} className={styles.featureCard} style={{ '--accent-color': color }}>
        <div className={styles.featureIcon}>{icon}</div>
        <div className={styles.featureContent}>
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDescription}>{description}</p>
        </div>
        <div className={styles.featureArrow}>→</div>
      </a>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Explore The Garden
          </Heading>
          <p className={styles.sectionSubtitle}>
            Discover comprehensive guides, tutorials, and technical resources
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
