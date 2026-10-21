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
      <div><span className={styles.eyebrow}>DEPARTURE NOTES · 21 OCT 2026</span>
        <h3 id={`${id}-title`}>{en ? 'Borobudur and Prambanan first.' : '婆羅浮屠登塔、普蘭巴南必去。'}</h3></div>
      <span className={styles.kitTag}>{en ? 'Solo Java + Singapore overnight' : '爪哇獨行＋新加坡過夜半日'}</span>
    </div>
    <p className={styles.note}>{en ? 'Protect 3 Nov Borobudur structure access and 4 Nov Prambanan; drop palace, small temples, city extras or waterfall first. An 08:30 structure session needs departure about 05:30–05:45, or choose a later session with matching transport. Retain the 30 Oct room provisionally and confirm the actual arrival date and any room hold from the flight ticket.' : '保留 11/03 婆羅浮屠登塔、11/04 普蘭巴南；先刪王宮、小寺、城市加點或瀑布。08:30 登塔場約 05:30–05:45 出發，或選較晚場次配合接送。暫保留 10/30 房，按機票確認真正落地日期與是否須保留房。'}</p>
    <div className={styles.deadlines}>
      <p><strong>{en ? 'Book now' : '現在落實'}</strong><span>{en ? 'Both temple tickets and transport first, then trains and a solo nature quote. Prices checked on 7 Oct are historical, not live stock.' : '先兩寺票與接送，再落實列車及單人自然段報價。10/07 查價是歷史記錄，不是即時庫存。'}</span></p>
      <p><strong>{en ? 'Arrival H−3' : '抵達前 H−3'}</strong><span>{en ? 'For 31 Oct arrival, from 28 Oct; recalculate for the actual ticketed date. All Indonesia is free and separate from the visa; follow the form’s allowed dates.' : '若 10/31 抵達，從 10/28 起；實際抵達日不同就重算。All Indonesia 免費，與簽證分開，以表單允許日期為準。'}</span></p>
      <p><strong>{en ? '4–5 Nov' : '11/04–05'}</strong><span>{en ? 'While still in Yogyakarta, confirm entrance, viewpoint, sand roads, crater permissions, solo total and closure refunds. Recheck weather and access before the 6 Nov departure and 7 Nov jeep pickup.' : '仍在日惹時確認入口、日出點、沙海道路、火山口許可、單人總價與關閉退款。11/06 出發前、11/07 吉普接人前再查天氣與開放。'}</span></p>
      <p><strong>{en ? '8 Nov · by 16:00' : '11/08 · 16:00 前到'}</strong><span>{en ? 'Leave central Surabaya about 13:00–13:30; reach SUB T2 by 16:00. SQ929 departs 19:10 and arrives SIN 22:30. Pack overnight cabin essentials; confirm bags tagged through to HKG.' : '約 13:00–13:30 離開泗水，16:00 前到 SUB T2；SQ929 19:10 飛、22:30 到 SIN。隔夜用品放隨身包，櫃檯確認行李直掛 HKG。'}</span></p>
      <p><strong>{en ? '9 Nov · T1 before 13:00' : '11/09 · 13:00 前回 T1'}</strong><span>{en ? 'Short morning visit only: finish activities by 10:30, leave the city by 11:00; allow for the T1 terminal transfer. SQ8670, operated by Scoot TR982, departs SIN T1 16:00 and arrives HKG T1 20:35.' : '只排上午短遊：10:30 結束活動、11:00 前離城，另留 T1 換樓時間。SQ8670 由酷航 TR982 執飛，16:00 SIN T1 出發、20:35 抵 HKG T1。'} <a href="#singapore-stopover">{en ? 'Overnight, entry and morning route →' : '住宿、入境與半日路線 →'}</a></span></p>
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
