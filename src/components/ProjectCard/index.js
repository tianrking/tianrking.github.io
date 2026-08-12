import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {featuredProjects} from '@site/src/data/featured-projects';
import styles from './styles.module.css';

const categoryLabels = {
  embedded: '嵌入式系統',
  hardware: '硬體',
  robotics: '機器人',
  ai: 'AI',
  infrastructure: '基礎設施',
  network: '網路工程',
  apps: '應用程式',
  tools: '開發工具',
  'embedded security': '嵌入式安全',
  'developer tools': '開發工具',
  experiments: '互動實驗',
};

const statusLabels = {
  active: '持續維護',
  maintained: '持續維護',
  experimental: '實驗中',
  demo: '可體驗',
  stable: '穩定',
  archived: '已封存',
  'bench verified': '實板驗證',
};

function humanize(value) {
  if (!value) {
    return '';
  }

  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getCategoryLabel(category) {
  return categoryLabels[String(category || '').toLowerCase()] || humanize(category) || '工程專案';
}

export function getStatusLabel(status) {
  return statusLabels[String(status || '').toLowerCase()] || humanize(status) || '專案';
}

export function getProjectLanguages(project) {
  const values = [
    project.language,
    project.github?.language,
    project.github?.primaryLanguage?.name,
    ...(project.github?.languages || []),
    ...(project.repositories || []).flatMap((repository) => [
      repository.language,
      repository.github?.language,
      repository.github?.primaryLanguage?.name,
      typeof repository.primaryLanguage === 'string'
        ? repository.primaryLanguage
        : repository.primaryLanguage?.name,
    ]),
  ];

  return [...new Set(values.filter(Boolean))];
}

function getRepositoryUrl(project) {
  if (project.links?.github) {
    return project.links.github;
  }

  if (project.githubUrl) {
    return project.githubUrl;
  }

  const repository = project.repo || project.repositories?.[0];
  return repository?.owner && repository?.name
    ? `https://github.com/${repository.owner}/${repository.name}`
    : null;
}

function mergeSnapshot(snapshotProjects) {
  const curatedById = new Map(featuredProjects.map((project) => [project.id, project]));
  const seen = new Set();
  const merged = snapshotProjects.map((project) => {
    const curated = curatedById.get(project.id) || {};
    seen.add(project.id);
    return {
      ...curated,
      ...project,
      links: {...curated.links, ...project.links},
    };
  });

  featuredProjects.forEach((project) => {
    if (!seen.has(project.id)) {
      merged.push(project);
    }
  });

  return merged;
}

export function useFeaturedProjects() {
  const snapshotUrl = useBaseUrl('/data/featured-projects.json');
  const [projects, setProjects] = useState(featuredProjects);
  const [snapshotState, setSnapshotState] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    fetch(snapshotUrl, {cache: 'no-cache'})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub snapshot returned ${response.status}`);
        }
        return response.json();
      })
      .then((snapshot) => {
        if (!cancelled && Array.isArray(snapshot.projects)) {
          setProjects(mergeSnapshot(snapshot.projects));
          setSnapshotState('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSnapshotState('fallback');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [snapshotUrl]);

  return useMemo(() => ({projects, snapshotState}), [projects, snapshotState]);
}

function ProjectMetric({label, value}) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return (
    <span className={styles.metric} title={label}>
      <span className={styles.metricLabel}>{label}</span>
      <strong>{value}</strong>
    </span>
  );
}

export default function ProjectCard({project, compact = false, accentColor}) {
  const titleId = `project-${project.id}-title`;
  const summary = project.summary || project.description;
  const tags = project.tags?.length ? project.tags : project.tech || [];
  const languages = getProjectLanguages(project);
  const displayTags = tags.filter((tag) => (
    !languages.some((language) => language.toLowerCase() === String(tag).toLowerCase())
  ));
  const repositoryUrl = getRepositoryUrl(project);
  const github = project.github || {};
  const stars = github.stars ?? github.stargazersCount ?? github.stargazerCount;
  const forks = github.forks ?? github.forksCount;
  const latestRelease = github.latestRelease?.tagName
    || github.latestRelease?.tag
    || github.latestRelease?.name
    || github.latestRelease;
  const docsUrl = project.links?.docs || project.docsUrl;
  const demoUrl = project.links?.demo || project.demoUrl;
  const repositoryCount = project.repositories?.length;

  return (
    <article
      aria-labelledby={titleId}
      className={`${styles.card} ${compact ? styles.compact : ''}`}
      style={accentColor ? {'--project-accent': accentColor} : undefined}>
      <div className={styles.cardTopline} aria-hidden="true" />

      <div className={styles.cardHeader}>
        <span className={styles.category}>{getCategoryLabel(project.category)}</span>
        <span className={`${styles.status} ${styles[String(project.status || '').toLowerCase().replace(/\s+/g, '')] || ''}`}>
          <span className={styles.statusDot} aria-hidden="true" />
          {getStatusLabel(project.status)}
        </span>
      </div>

      {project.image && !compact ? (
        <div className={styles.imageFrame}>
          <img src={project.image} alt="" className={styles.image} loading="lazy" />
        </div>
      ) : null}

      <div className={styles.content}>
        <h3 id={titleId} className={styles.title}>{project.title}</h3>
        <p className={styles.summary}>{summary}</p>

        <div className={styles.tags} aria-label="技術標籤">
          {languages.map((language) => (
            <span key={language} className={styles.language}>{language}</span>
          ))}
          {displayTags.slice(0, compact ? 3 : 5).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.metrics} aria-label="GitHub 專案資料">
          <ProjectMetric label="Stars" value={stars} />
          <ProjectMetric label="Forks" value={forks} />
          <ProjectMetric label="Release" value={latestRelease} />
          {repositoryCount > 1 ? (
            <ProjectMetric label="Repos" value={repositoryCount} />
          ) : null}
        </div>

        <div className={styles.links}>
          {docsUrl ? <Link to={docsUrl}>技術筆記</Link> : null}
          {demoUrl ? (
            <a href={demoUrl} target="_blank" rel="noopener noreferrer">
              Demo <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {repositoryUrl ? (
            <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
