import React, { useState } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import ProjectCard from '@site/src/components/ProjectCard';
import { roboticsLabData } from '@site/src/data/robotics-lab-projects';
import styles from './styles.module.css';

export default function RoboticsLab() {
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all'
    ? roboticsLabData.projects
    : roboticsLabData.projects.filter(p => p.status === filter);

  const stats = {
    total: roboticsLabData.projects.length,
    active: roboticsLabData.projects.filter(p => p.status === 'active').length,
    demo: roboticsLabData.projects.filter(p => p.status === 'demo').length,
    archived: roboticsLabData.projects.filter(p => p.status === 'archived').length,
  };

  return (
    <Layout
      title={`${roboticsLabData.lab.title} - El Jardín Secreto`}
      description={roboticsLabData.lab.description}
    >
      <div className={styles.pageWrapper}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroIcon}>{roboticsLabData.lab.icon}</div>
              <h1 className={styles.heroTitle}>
                {roboticsLabData.lab.title}
              </h1>
              <p className={styles.heroDescription}>
                {roboticsLabData.lab.description}
              </p>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{stats.total}</div>
                  <div className={styles.statLabel}>Total Projects</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: '#10b981' }}>
                    {stats.active}
                  </div>
                  <div className={styles.statLabel}>Active</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: '#3b82f6' }}>
                    {stats.demo}
                  </div>
                  <div className={styles.statLabel}>Demo</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: '#6b7280' }}>
                    {stats.archived}
                  </div>
                  <div className={styles.statLabel}>Archived</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className={styles.filterSection}>
          <div className="container">
            <div className={styles.filters}>
              <button
                className={clsx(styles.filterButton, filter === 'all' && styles.active)}
                onClick={() => setFilter('all')}
              >
                All ({stats.total})
              </button>
              <button
                className={clsx(styles.filterButton, filter === 'active' && styles.active)}
                onClick={() => setFilter('active')}
              >
                🚀 Active ({stats.active})
              </button>
              <button
                className={clsx(styles.filterButton, filter === 'demo' && styles.active)}
                onClick={() => setFilter('demo')}
              >
                🎮 Demo ({stats.demo})
              </button>
              <button
                className={clsx(styles.filterButton, filter === 'archived' && styles.active)}
                onClick={() => setFilter('archived')}
              >
                📦 Archived ({stats.archived})
              </button>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className={styles.projectsSection}>
          <div className="container">
            {filteredProjects.length > 0 ? (
              <div className="row">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    accentColor={roboticsLabData.lab.color}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No projects found for this filter.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
