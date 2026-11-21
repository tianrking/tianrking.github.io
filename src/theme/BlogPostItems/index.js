import React from 'react';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import BlogPostItems from '@theme-original/BlogPostItems';

export default function BlogPostItemsWithHeading(props) {
  const {pathname} = useLocation();
  const blogPath = useBaseUrl('/blog');
  const currentPath = pathname.replace(/\/$/, '');
  const pagePrefix = `${blogPath}/page/`;
  const isBlogList = currentPath === blogPath
    || (currentPath.startsWith(pagePrefix) && /^\d+$/.test(currentPath.slice(pagePrefix.length)));

  return (
    <>
      {isBlogList && (
        <header className="blog-list-heading">
          <div>
            <h1 className="blog-list-title">開發誌</h1>
            <p>嵌入式系統、在地 AI 與基礎設施的實作紀錄。</p>
          </div>
          <nav aria-label="開發誌索引">
            <a href={`${blogPath}/archive`}>文章總覽</a>
            <a href={`${blogPath}/tags`}>所有標籤</a>
          </nav>
        </header>
      )}
      <BlogPostItems {...props} />
    </>
  );
}
