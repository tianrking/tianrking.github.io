import React, { useId, useState } from 'react';
import { buildCalendar, MAX_START_DATE } from './calendar.mjs';
import styles from './styles.module.css';

export default function JavaTripPlanner() {
  const [startDate, setStartDate] = useState('');
  const id = useId();
  const calendar = buildCalendar(startDate);
  const invalid = calendar.status === 'invalid';
  const ready = calendar.status === 'ready';
  const statusText = ready
    ? `已排出 10 天、${calendar.totalNights} 晚住宿。${calendar.alerts.length ? `有 ${calendar.alerts.length} 項閉館或禮拜提醒，請查看對應日期。` : '仍請核對公共假期與臨時開放公告。'}`
    : invalid ? calendar.error : '選擇 D1 抵達雅加達的日期，即可查看完整日期與住宿區間。';

  return (
    <section className={styles.planner} aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>出發日期檢查</h3>
      <p className={styles.intro} id={`${id}-help`}>
        以 D1 抵達雅加達的當地日期計算。只檢查日期與固定週休，不查車票、機票或住宿庫存，也不會自動改動行程。
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
            <h4>每城一間酒店，3＋4＋2 晚</h4>
            <ul>
              {calendar.stays.map((stay) => (
                <li key={stay.city}>
                  <strong>{stay.city}</strong>：<time dateTime={stay.checkIn}>{stay.checkIn}</time> 入住，
                  <time dateTime={stay.checkOut}>{stay.checkOut}</time> 退房（{stay.nights} 晚）。
                </li>
              ))}
            </ul>
            <p>以上是規劃日期，不代表已完成預訂；如果跨城交通改成夜車，住宿晚數需要重新計算。</p>
          </div>
        </>
      ) : null}
    </section>
  );
}
