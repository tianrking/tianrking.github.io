import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

export default function BlogArchive({archive}) {
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const dates = new Intl.DateTimeFormat(currentLocale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
  const postsByYear = new Map();
  for (const {metadata} of archive.blogPosts) {
    const year = metadata.date.slice(0, 4);
    if (!postsByYear.has(year)) postsByYear.set(year, []);
    postsByYear.get(year).push(metadata);
  }

  const description = '按年份瀏覽所有開發誌文章。';
  return (
    <Layout title="歷史文章" description={description}>
      <main className="container blog-archive">
        <header className="blog-list-heading">
          <div>
            <h1 className="blog-list-title">歷史文章</h1>
            <p>{description}</p>
          </div>
        </header>
        {Array.from(postsByYear, ([year, posts]) => (
          <section key={year} aria-labelledby={year} className="blog-archive-year">
            <Heading as="h2" id={year}>{year}</Heading>
            <ul>
              {posts.reverse().map(({date, permalink, title}) => (
                <li key={permalink}>
                  <a href={permalink}>
                    <time dateTime={date}>{dates.format(new Date(date))}</time>
                    <span>{title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </Layout>
  );
}
