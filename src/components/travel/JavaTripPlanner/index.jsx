import React, { useId, useState } from 'react';
import { buildCalendar, MAX_START_DATE, TRIP_START_DATE } from './calendar.mjs';
import styles from './styles.module.css';

export default function JavaTripPlanner() {
  const [startDate, setStartDate] = useState(TRIP_START_DATE);
  const id = useId();
  const calendar = buildCalendar(startDate);
  const invalid = calendar.status === 'invalid';
  const ready = calendar.status === 'ready';
  const statusText = ready
    ? `已排出 10 天、${calendar.totalNights} 晚住宿。${calendar.alerts.length ? `有 ${calendar.alerts.length} 項閉館或禮拜提醒，請查看對應日期。` : '仍請核對公共假期與臨時開放公告。'}`
    : invalid ? calendar.error : '選擇 D1 抵達雅加達的日期，即可查看完整日期與住宿區間。';

  return (
    <section className={styles.planner} aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>十天日曆與九晚住宿</h3>
      <p className={styles.intro} id={`${id}-help`}>
        預設本次 2026-10-30 出發日期。以 D1 抵達雅加達的當地日期計算；改日期只重算週休與住宿，不會改動正文的固定航班，也不查即時庫存、天氣或火山開放狀態。
      </p>
      <div className={styles.controls}>
        <label htmlFor={`${id}-date`}>D1 抵達日期</label>
        <input
          id={`${id}-date`}
          type="date"
          min="0001-01-01"
          max={MAX_START_DATE}
          value={startDate}
          aria-invalid={invalid}
          aria-describedby={`${id}-help ${id}-status`}
          onChange={(event) => setStartDate(event.target.value)}
        />
        <button type="button" onClick={() => setStartDate('')} disabled={!startDate}>
          清空日期
        </button>
        <button type="button" onClick={() => setStartDate(TRIP_START_DATE)} disabled={startDate === TRIP_START_DATE}>
          本次航班日期
        </button>
      </div>
      <p
        id={`${id}-status`}
        className={invalid ? styles.error : styles.status}
        aria-live="polite"
        aria-atomic="true"
      >
        {statusText}
      </p>
      {ready ? (
        <>
        <ol className={styles.days} aria-label="十天日期、所在城市與住宿" role="list">
            {calendar.days.map((day) => (
              <li className={styles.day} key={day.day}>
                <div className={styles.date}>
                  <span className={styles.dayNumber}>D{day.day}</span>
                  <time dateTime={day.date}>{day.date}</time>
                  <span>{day.weekdayLabel}</span>
                </div>
                <div className={styles.route}>
                  <strong>{day.title}</strong>
                  <span>{day.city}</span>
                </div>
                <p className={styles.night}>{day.stay ? `住宿：${day.stay}` : '返程日，不住宿'}</p>
                {day.alerts.map((alert) => (
                  <p
                    key={alert.code}
                    className={alert.severity === 'closure' ? styles.warning : styles.prayer}
                  >
                    {alert.text}
                  </p>
                ))}
              </li>
            ))}
          </ol>
          <div className={styles.stays}>
            <h4>五處住宿，3＋3＋1＋1＋1 晚</h4>
            <ul>
              {calendar.stays.map((stay) => (
                <li key={stay.city}>
                  <strong>{stay.city}</strong>：<time dateTime={stay.checkIn}>{stay.checkIn}</time> 入住，
                  <time dateTime={stay.checkOut}>{stay.checkOut}</time> 退房（{stay.nights} 晚）。
                </li>
              ))}
            </ul>
            <p>山腳一晚若已包含在兩天一晚團費中，不另訂、不重複計費；以上日期不代表已完成預訂。</p>
          </div>
        </>
      ) : null}
    </section>
  );
}
