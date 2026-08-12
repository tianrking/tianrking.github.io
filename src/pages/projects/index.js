import React, {useId, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ProjectCard, {
  getCategoryLabel,
  getProjectLanguages,
  getStatusLabel,
  useFeaturedProjects,
} from '@site/src/components/ProjectCard';
import styles from './styles.module.css';

function FilterGroup({id, label, value, onChange, options}) {
  return (
    <label className={styles.filter} htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">全部</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export default function ProjectsPage() {
  const {projects, snapshotState} = useFeaturedProjects();
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [language, setLanguage] = useState('all');
  const categoryId = useId();
  const statusId = useId();
  const languageId = useId();

  const categories = useMemo(() => (
    [...new Set(projects.map((project) => project.category).filter(Boolean))]
      .map((value) => ({value, label: getCategoryLabel(value)}))
  ), [projects]);

  const statuses = useMemo(() => (
    [...new Set(projects.map((project) => project.status).filter(Boolean))]
      .map((value) => ({value, label: getStatusLabel(value)}))
  ), [projects]);

  const languages = useMemo(() => (
    [...new Set(projects.flatMap(getProjectLanguages))]
      .sort((left, right) => left.localeCompare(right))
      .map((value) => ({value, label: value}))
  ), [projects]);

  const filteredProjects = projects.filter((project) => {
    const categoryMatches = category === 'all' || project.category === category;
    const statusMatches = status === 'all' || project.status === status;
    const languageMatches = language === 'all' || getProjectLanguages(project).includes(language);
    return categoryMatches && statusMatches && languageMatches;
  });

  const resetFilters = () => {
    setCategory('all');
    setStatus('all');
    setLanguage('all');
  };

  return (
    <Layout
      title="專案"
      description="一些嵌入式、Local AI、基礎設施與應用專案。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <span className={styles.eyebrow}>PROJECTS</span>
            <Heading as="h1">最近做的一些專案。</Heading>
            <div className={styles.heroBottom}>
              <p>
                有些已經能用，有些還在慢慢更新。可以依領域、狀態和語言篩選，其他公開專案都在 GitHub。
              </p>
            </div>
          </div>
        </header>

        <section className={styles.indexSection} aria-labelledby="project-index-heading">
          <div className="container">
            <div className={styles.toolbar}>
              <div>
                <span className={styles.eyebrow}>FILTER</span>
                <Heading id="project-index-heading" as="h2">專案列表</Heading>
              </div>
              <div className={styles.filters}>
                <FilterGroup
                  id={categoryId}
                  label="領域"
                  value={category}
                  onChange={setCategory}
                  options={categories}
                />
                <FilterGroup
                  id={statusId}
                  label="狀態"
                  value={status}
                  onChange={setStatus}
                  options={statuses}
                />
                <FilterGroup
                  id={languageId}
                  label="語言"
                  value={language}
                  onChange={setLanguage}
                  options={languages}
                />
              </div>
            </div>

            <div className={styles.resultSummary} aria-live="polite">
              <span>顯示 {filteredProjects.length} / {projects.length} 個專案</span>
              <span>
                {snapshotState === 'fallback'
                  ? 'GitHub 更新暫時不可用，使用網站內建快照'
                  : '公開 GitHub 資訊由建置快照更新'}
              </span>
            </div>

            {filteredProjects.length ? (
              <div className={styles.grid}>
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <span aria-hidden="true">00</span>
                <Heading as="h3">沒有符合這組條件的專案</Heading>
                <p>調整篩選，或查看全部專案。</p>
                <button type="button" onClick={resetFilters}>清除篩選</button>
              </div>
            )}
          </div>
        </section>

        <section className={styles.principle}>
          <div className={`container ${styles.principleInner}`}>
            <span className={styles.principleNumber}>MORE</span>
            <div>
              <span className={styles.eyebrow}>ON GITHUB</span>
              <Heading as="h2">其他公開專案</Heading>
              <p>這裡只列出一部分，完整列表可以到 GitHub 查看。</p>
            </div>
            <a href="https://github.com/tianrking?tab=repositories" target="_blank" rel="noopener noreferrer">
              查看所有公開倉庫 <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
