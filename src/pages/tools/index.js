import React, { useState } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import { toolsData } from '@site/src/data/tools-data';
import styles from './styles.module.css';

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const totalTools = toolsData.categories.reduce((acc, cat) => acc + cat.tools.length, 0);
  const featuredTools = toolsData.categories.reduce((acc, cat) => acc + cat.tools.filter(t => t.featured).length, 0);

  const filteredCategories = selectedCategory === 'all'
    ? toolsData.categories
    : toolsData.categories.filter(cat => cat.id === selectedCategory);

  return (
    <Layout
      title={`${toolsData.lab.title} - El Jardín Secreto`}
      description={toolsData.lab.description}
    >
      <div className={styles.pageWrapper}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroIcon}>{toolsData.lab.icon}</div>
              <h1 className={styles.heroTitle}>
                {toolsData.lab.title}
              </h1>
              <p className={styles.heroDescription}>
                {toolsData.lab.description}
              </p>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{toolsData.categories.length}</div>
                  <div className={styles.statLabel}>Categories</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: toolsData.lab.color }}>
                    {totalTools}
                  </div>
                  <div className={styles.statLabel}>Total Tools</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: '#10b981' }}>
                    {featuredTools}
                  </div>
                  <div className={styles.statLabel}>Featured</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: '#f59e0b' }}>
                    {toolsData.categories.filter(c => c.tools.some(t => t.status === 'active')).length}
                  </div>
                  <div className={styles.statLabel}>Active Categories</div>
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
                className={clsx(styles.filterButton, selectedCategory === 'all' && styles.active)}
                onClick={() => setSelectedCategory('all')}
              >
                All Categories ({toolsData.categories.length})
              </button>
              {toolsData.categories.map((category) => (
                <button
                  key={category.id}
                  className={clsx(styles.filterButton, selectedCategory === category.id && styles.active)}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon} {category.name} ({category.tools.length})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className={styles.toolsSection}>
          <div className="container">
            {filteredCategories.map((category) => (
              <div key={category.id} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>{category.icon}</div>
                  <div className={styles.categoryInfo}>
                    <h2 className={styles.categoryTitle}>{category.name}</h2>
                    <p className={styles.categoryDescription}>{category.description}</p>
                  </div>
                </div>

                <div className="row">
                  {category.tools.map((tool) => (
                    <div key={tool.id} className="col col--4">
                      <div className={styles.toolCard}>
                        <div className={styles.toolCardHeader}>
                          <div className={styles.toolName}>{tool.name}</div>
                          {tool.featured && (
                            <span className={styles.featuredBadge}>⭐ Featured</span>
                          )}
                        </div>
                        <p className={styles.toolDescription}>{tool.description}</p>
                        <div className={styles.toolTags}>
                          {tool.tags.map((tag) => (
                            <span key={tag} className={styles.toolTag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className={styles.toolLinks}>
                          {tool.website && (
                            <a
                              href={tool.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.toolLink}
                            >
                              🌐 Website
                            </a>
                          )}
                          {tool.github && (
                            <a
                              href={tool.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.toolLink}
                            >
                              💻 GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className={styles.noResults}>
                <p>No tools found for this category.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
