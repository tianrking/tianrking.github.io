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
      description="w0x7ce 的精選嵌入式、Local AI、基礎設施與應用專案。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <span className={styles.eyebrow}>PROJECT INDEX / CURATED</span>
            <Heading as="h1">專案不是倉庫清單，<br />而是一段段完成工作的證據。</Heading>
            <div className={styles.heroBottom}>
              <p>
                這裡只選擇有代表性的作品，呈現它解決的問題、主要技術、維護狀態與公開成果。Fork、練習和一次性測試不會自動進入列表。
              </p>
              <div className={styles.legend} aria-label="證據分層說明">
                <span><i className={styles.buildDot} /> Build</span>
                <span><i className={styles.benchDot} /> Bench</span>
                <span><i className={styles.productionDot} /> Production</span>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.indexSection} aria-labelledby="project-index-heading">
          <div className="container">
            <div className={styles.toolbar}>
              <div>
                <span className={styles.eyebrow}>FILTER</span>
                <Heading id="project-index-heading" as="h2">精選作品</Heading>
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
                <p>調整篩選，或回到完整的精選作品列表。</p>
                <button type="button" onClick={resetFilters}>清除篩選</button>
              </div>
            )}
          </div>
        </section>

        <section className={styles.principle}>
          <div className={`container ${styles.principleInner}`}>
            <span className={styles.principleNumber}>01—03</span>
            <div>
              <span className={styles.eyebrow}>EDITORIAL POLICY</span>
              <Heading as="h2">選擇少一點，說清楚多一點。</Heading>
              <p>每個專案都應能回答三個問題：它解決什麼、我實際做了什麼、目前驗證到哪一層。</p>
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
