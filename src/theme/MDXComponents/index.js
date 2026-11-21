import React, {useEffect, useRef, useState} from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import {useLocation} from '@docusaurus/router';

function ReadingTable(props) {
  const scrollRef = useRef(null);
  const tableRef = useRef(null);
  const [overflowLabel, setOverflowLabel] = useState();
  const {search} = useLocation();
  const english = new URLSearchParams(search).get('lang') === 'en';

  useEffect(() => {
    const container = scrollRef.current;
    const table = tableRef.current;
    const measure = () => {
      if (container.scrollWidth <= container.clientWidth + 1) {
        setOverflowLabel(undefined);
        return;
      }
      const tables = document.querySelectorAll('.reading-table__scroll');
      const number = Array.from(tables).indexOf(container) + 1;
      const title = table.caption?.textContent.trim();
      const label = english ? `Table ${number} (scroll horizontally)` : `表格 ${number}（可左右捲動）`;
      setOverflowLabel(title ? `${title} · ${label}` : label);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(table);
    return () => observer.disconnect();
  }, [english]);

  return <div className="reading-table">
    {overflowLabel && <div className="reading-table__hint" aria-hidden="true">{english ? 'Scroll sideways to see all columns' : '向左右滑動查看完整欄位'} <span>↔</span></div>}
    <div ref={scrollRef} className="reading-table__scroll"
      role={overflowLabel ? 'region' : undefined} tabIndex={overflowLabel ? 0 : undefined}
      aria-label={overflowLabel}>
      <table {...props} ref={tableRef} />
    </div>
  </div>;
}

export default {...MDXComponents, table: ReadingTable};
