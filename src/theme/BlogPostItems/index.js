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
      {isBlogList && <h1 className="blog-list-title">開發誌</h1>}
      <BlogPostItems {...props} />
    </>
  );
}
