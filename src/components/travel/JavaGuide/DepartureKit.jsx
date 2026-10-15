import React, {useEffect, useId, useState} from 'react';
import {HOTEL_ADDRESS, READINESS_KEY, TASKS, readTasks} from './readiness.mjs';
import styles from './styles.module.css';

export default function DepartureKit({language = 'zh'}) {
  const en = language === 'en';
  const id = useId();
  const [checked, setChecked] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => {
    try { setChecked(readTasks(window.localStorage.getItem(READINESS_KEY))); }
    catch { setStorageError(true); }
    setLoaded(true);
  }, []);
  function save(next) {
    setChecked(next);
    try { window.localStorage.setItem(READINESS_KEY, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  }
  async function copyAddress() {
    try { await navigator.clipboard.writeText(HOTEL_ADDRESS); setCopyStatus('copied'); }
    catch { setCopyStatus('failed'); }
  }
  return <section className={styles.kit} aria-labelledby={`${id}-title`}>
    <div className={styles.kitHeading}>
      <div><span className={styles.eyebrow}>DEPARTURE NOTES · 15 OCT 2026</span>
        <h3 id={`${id}-title`}>{en ? 'Keep the route. Secure the essentials.' : '路線不變，把關鍵預訂落實。'}</h3></div>
      <span className={styles.kitTag}>{en ? '30 Oct departure · 31 Oct arrival' : '10/30 出發 · 10/31 抵達'}</span>
    </div>
    <p className={styles.note}>{en ? 'The booked 30 Oct room is retained. The ten-day calendar starts with departure, not ten full days on the ground. On 31 Oct, start after arrival and rest; shorten the harbour/tower stops if needed, protecting Museum BI before closing.' : '保留已訂 10/30 房間。十天日曆包含出發日，不是十個完整當地遊覽日；10/31 入境、到店與休息後再出門，必要時縮短港口／塔樓，保住銀行館關門前的時間。'}</p>
    <div className={styles.deadlines}>
      <p><strong>{en ? 'Book now' : '現在落實'}</strong><span>{en ? 'Two night trains · Borobudur Structure · 6–7 Nov nature transfer. Prices checked on 7 Oct are historical, not live stock.' : '雙夜車、婆羅浮屠 Structure、11/06–07 自然接送。10/07 查價是歷史記錄，不是即時庫存。'}</span></p>
      <p><strong>{en ? 'From 28 Oct' : '10/28 起'}</strong><span>{en ? 'All Indonesia for 31 Oct arrival; free declaration, separate from the visa. Follow the form’s allowed arrival dates.' : '按 10/31 抵達填免費 All Indonesia，與簽證分開；以表單允許的抵達日期為準。'}</span></p>
      <p><strong>{en ? '5–6 Nov' : '11/05–06'}</strong><span>{en ? 'Recheck park access, waterfall conditions, weather, pickup and cancellation terms. An open park is not permission for every trail.' : '再查公園開放、瀑布水況、天氣、接人與退改。公園開放不等於每條步道都可走。'}</span></p>
    </div>
    <details className={styles.checklist}>
      <summary>{en ? `My departure checklist · ${checked.length}/${TASKS.length}` : `我的行前清單 · ${checked.length}/${TASKS.length}`}</summary>
      <p className={styles.note}>{en ? 'Personal checks saved only in this browser, not booking verification or cloud sync. No passport, order or payment data is stored.' : '勾選只保存在本瀏覽器，不是網站驗證的預訂狀態，也不跨裝置同步。不保存護照、訂單或付款資料。'}</p>
      <ul className={styles.taskList}>{TASKS.map((task) => <li key={task.id}>
        <label><input type="checkbox" disabled={!loaded} checked={checked.includes(task.id)} onChange={(event) => save(event.target.checked ? [...checked, task.id] : checked.filter((key) => key !== task.id))} />
          <span>{en ? task.en : task.zh}</span></label>
        <a href={`#${task.anchor}`} aria-label={`${en ? 'Read details: ' : '查看詳情：'}${en ? task.en : task.zh}`}>{en ? 'Details' : '詳情'} ↗</a>
      </li>)}</ul>
      <p className={styles.note} role="status">{storageError ? (en ? 'Browser storage unavailable: checks work for this visit only.' : '瀏覽器儲存不可用：勾選只在本次頁面保留。') : en ? 'Saved locally in this browser.' : '已在本瀏覽器保存。'}</p>
      <button type="button" className={styles.utility} disabled={!loaded || checked.length === 0} onClick={() => save([])}>{en ? 'Clear my checks' : '清空我的勾選'}</button>
    </details>
    <div className={styles.address}><div><strong>{en ? 'First hotel · show the driver' : '首晚酒店 · 可直接給司機看'}</strong><p>{HOTEL_ADDRESS}</p></div>
      <button type="button" className={styles.utility} onClick={copyAddress}>{en ? 'Copy address' : '複製地址'}</button>
      <span className={styles.note} role="status">{copyStatus === 'copied' ? (en ? 'Address copied.' : '地址已複製。') : copyStatus === 'failed' ? (en ? 'Copy unavailable. Select the visible address above.' : '無法自動複製，請選取上方完整地址。') : ''}</span>
    </div>
    <p className={styles.note}>{en ? 'Optional exhibitions and the festival are below; choose at most one extra Jakarta activity, after the main sights and only if rested.' : '當期展覽與文化節在下方；雅加達額外活動最多選一項，主線完成且休息足夠才去。'} <a href="#seasonal">{en ? 'See dated options →' : '查看當期可選活動 →'}</a></p>
  </section>;
}
