import React from 'react';
import BlogLayout from '@theme-original/BlogLayout';

export default function BlogLayoutWithToc({toc, ...props}) {
  return (
    <BlogLayout
      {...props}
      toc={toc && <nav className="blog-toc-landmark" aria-label="本文目錄">{toc}</nav>}
    />
  );
}
