import React, {useEffect, useRef, useState} from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import {useLocation} from '@docusaurus/router';

function ReadingTable(props) {
  const scrollRef = useRef(null);
  const tableRef = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const {search} = useLocation();
  const english = new URLSearchParams(search).get('lang') === 'en';

  useEffect(() => {
    const container = scrollRef.current;
    const measure = () => setOverflow(container.scrollWidth > container.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(tableRef.current);
    return () => observer.disconnect();
  }, []);

  return <div className="reading-table">
    {overflow && <div className="reading-table__hint" aria-hidden="true">{english ? 'Scroll sideways to see all columns' : '向左右滑動查看完整欄位'} <span>↔</span></div>}
    <div ref={scrollRef} className="reading-table__scroll"
      role={overflow ? 'region' : undefined} tabIndex={overflow ? 0 : undefined}
      aria-label={overflow ? (english ? 'Horizontally scrollable table' : '可左右捲動的表格') : undefined}>
      <table {...props} ref={tableRef} />
    </div>
  </div>;
}

export default {...MDXComponents, table: ReadingTable};
