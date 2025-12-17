import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function ProjectCard({ project, accentColor }) {
  const {
    title,
    description,
    image,
    tech = [],
    demoUrl,
    githubUrl,
    docsUrl,
    status = 'active',
    tags = [],
    date,
  } = project;

  return (
    <div
      className={clsx('col col--4', styles.projectCard)}
      style={{ '--accent-color': accentColor }}
    >
      <div className={styles.card}>
        {/* Status Badge */}
        {status && (
          <div className={clsx(styles.statusBadge, styles[status])}>
            {status === 'active' && '🚀 Active'}
            {status === 'demo' && '🎮 Demo'}
            {status === 'archived' && '📦 Archived'}
          </div>
        )}

        {/* Project Image */}
        {image && (
          <div className={styles.imageContainer}>
            <img src={image} alt={title} className={styles.projectImage} />
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          {/* Tech Stack */}
          {tech.length > 0 && (
            <div className={styles.techStack}>
              {tech.map((item, idx) => (
                <span key={idx} className={styles.techItem}>
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag, idx) => (
                <span key={idx} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Date */}
          {date && <p className={styles.date}>{date}</p>}
        </div>

        {/* Links */}
        <div className={styles.links}>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(styles.linkButton, styles.primary)}
            >
              <span>🚀</span> Live Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkButton}
            >
              <span>🐙</span> Code
            </a>
          )}
          {docsUrl && (
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkButton}
            >
              <span>📚</span> Docs
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
