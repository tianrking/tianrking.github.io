import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import { externalSitesData } from '@site/src/data/external-sites-data';
import styles from './styles.module.css';

export default function ExternalLab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calculate stats
  const stats = useMemo(() => {
    const totalSites = externalSitesData.categories.reduce((acc, cat) => acc + cat.sites.length, 0);
    const featuredCount = externalSitesData.categories.reduce(
      (acc, cat) => acc + cat.sites.filter(s => s.featured).length, 0
    );
    return { totalSites, featuredCount };
  }, []);

  // Filter sites based on search and category
  const filteredCategories = useMemo(() => {
    let filtered = externalSitesData.categories;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cat => cat.id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered
        .map(cat => ({
          ...cat,
          sites: cat.sites.filter(
            site =>
              site.name.toLowerCase().includes(query) ||
              site.description.toLowerCase().includes(query) ||
              site.tags.some(tag => tag.toLowerCase().includes(query))
          ),
        }))
        .filter(cat => cat.sites.length > 0);
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <Layout
      title={`${externalSitesData.lab.title} - El Jardín Secreto`}
      description={externalSitesData.lab.description}
    >
      <div className={styles.pageWrapper}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroIcon}>{externalSitesData.lab.icon}</div>
              <h1 className={styles.heroTitle}>
                {externalSitesData.lab.title}
              </h1>
              <p className={styles.heroDescription}>
                {externalSitesData.lab.description}
              </p>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{externalSitesData.categories.length}</div>
                  <div className={styles.statLabel}>Categories</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: externalSitesData.lab.color }}>
                    {stats.totalSites}
                  </div>
                  <div className={styles.statLabel}>Total Sites</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: '#f59e0b' }}>
                    {stats.featuredCount}
                  </div>
                  <div className={styles.statLabel}>Featured</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className={styles.searchSection}>
          <div className="container">
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  className={styles.clearButton}
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
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
                <span>All</span>
                <span className={styles.filterCount}>
                  {externalSitesData.categories.reduce((acc, cat) => acc + cat.sites.length, 0)}
                </span>
              </button>
              {externalSitesData.categories.map((category) => (
                <button
                  key={category.id}
                  className={clsx(styles.filterButton, selectedCategory === category.id && styles.active)}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{ '--category-color': category.color }}
                >
                  <span>{category.icon} {category.name}</span>
                  <span className={styles.filterCount}>{category.sites.length}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Sites Grid */}
        <section className={styles.sitesSection}>
          <div className="container">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id} className={styles.categorySection}>
                  <div className={styles.categoryHeader}>
                    <div
                      className={styles.categoryIcon}
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div className={styles.categoryInfo}>
                      <h2 className={styles.categoryTitle}>{category.name}</h2>
                      <p className={styles.categoryDescription}>{category.description}</p>
                    </div>
                    <div className={styles.categoryCount}>
                      {category.sites.length} project{category.sites.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className={styles.sitesGrid}>
                    {category.sites.map((site) => (
                      <a
                        key={site.id}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.siteCard}
                      >
                        {site.featured && (
                          <div className={styles.featuredBadge}>
                            <span>⭐</span> Featured
                          </div>
                        )}

                        <div className={styles.screenshotWrapper}>
                          <img
                            src={site.screenshot}
                            alt={site.name}
                            className={styles.screenshot}
                            loading="lazy"
                          />
                          <div className={styles.screenshotOverlay}>
                            <span className={styles.visitText}>Visit Site</span>
                          </div>
                        </div>

                        <div className={styles.cardContent}>
                          <h3 className={styles.siteName}>{site.name}</h3>
                          <p className={styles.siteDescription}>{site.description}</p>

                          <div className={styles.tags}>
                            {site.tags.map((tag) => (
                              <span key={tag} className={styles.tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={styles.cardFooter}>
                          <span className={styles.externalIcon}>↗</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3>No projects found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button
                  className={styles.resetButton}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
