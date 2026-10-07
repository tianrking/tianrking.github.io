import React, { useId, useState } from 'react';
import { buildCalendar, MAX_START_DATE, TRIP_START_DATE } from './calendar.mjs';
import styles from './styles.module.css';
import {DAY_TITLES, DAY_CITIES, CITY_NAMES, ALERTS} from './english.mjs';

export default function JavaTripPlanner({language = 'zh'}) {
  const en = language === 'en';
  const [startDate, setStartDate] = useState(TRIP_START_DATE);
  const id = useId();
  const calendar = buildCalendar(startDate);
  const invalid = calendar.status === 'invalid';
  const ready = calendar.status === 'ready';
  const statusText = en ? (ready
    ? `10 days, ${calendar.hotelNights} hotel nights and ${calendar.trainNights} overnight trains. ${calendar.alerts.length ? `${calendar.alerts.length} closure or prayer reminders: check the corresponding days.` : 'Confirm actual train times, availability and temporary opening notices.'}`
    : invalid ? `Choose a valid arrival date no later than ${MAX_START_DATE}.` : 'Choose the local D1 arrival date in Jakarta to see dates and stays.') : ready
    ? `已排出 10 天、${calendar.hotelNights} 晚酒店＋${calendar.trainNights} 晚夜火車。${calendar.alerts.length ? `有 ${calendar.alerts.length} 項閉館或禮拜提醒，請查看對應日期。` : '列車時間、餘票與臨時開放仍須核對。'}`
    : invalid ? calendar.error : '選擇 D1 抵達雅加達的日期，即可查看完整日期與住宿區間。';

  return (
    <section className={styles.planner} aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{en ? 'Ten-day calendar: seven hotel nights, two night trains' : '十天日曆：七晚酒店、兩晚夜火車'}</h3>
      <p className={styles.intro} id={`${id}-help`}>
        {en ? 'Default: 2026-10-30. Calculated from the local D1 arrival date in Jakarta. Changing this date recalculates weekly closures and stays only; it does not change the fixed flights or check live inventory, weather or volcano access.' : '預設本次 2026-10-30 出發日期。以 D1 抵達雅加達的當地日期計算；改日期只重算週休與住宿，不會改動正文的固定航班，也不查即時庫存、天氣或火山開放狀態。'}
      </p>
      <div className={styles.controls}>
        <label htmlFor={`${id}-date`}>{en ? 'D1 arrival date' : 'D1 抵達日期'}</label>
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
          {en ? 'Clear date' : '清空日期'}
        </button>
        <button type="button" onClick={() => setStartDate(TRIP_START_DATE)} disabled={startDate === TRIP_START_DATE}>
          {en ? 'Reset to this trip' : '本次航班日期'}
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
        <ol className={styles.days} aria-label={en ? 'Ten days, cities and overnight stays' : '十天日期、所在城市與住宿'} role="list">
            {calendar.days.map((day) => (
              <li className={styles.day} key={day.day}>
                <div className={styles.date}>
                  <span className={styles.dayNumber}>D{day.day}</span>
                  <time dateTime={day.date}>{day.date}</time>
                  <span>{en ? ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][day.weekday] : day.weekdayLabel}</span>
                </div>
                <div className={styles.route}>
                  <strong>{en ? DAY_TITLES[day.day - 1] : day.title}</strong>
                  <span>{en ? DAY_CITIES[day.day - 1] : day.city}</span>
                </div>
                <p className={styles.night}>{en ? (day.overnight ? `Overnight train: ${DAY_CITIES[day.day - 1]} (not booked)` : day.stay ? `Stay: ${CITY_NAMES[day.stay]}` : 'Departure day; no overnight stay') : day.overnight ? `車上過夜：${day.overnight}（待訂）` : day.stay ? `住宿：${day.stay}` : '返程日，不住宿'}</p>
                {day.alerts.map((alert) => (
                  <p
                    key={alert.code}
                    className={alert.severity === 'closure' ? styles.warning : styles.prayer}
                  >
                    {en ? ALERTS[alert.code] : alert.text}
                  </p>
                ))}
              </li>
            ))}
          </ol>
          <div className={styles.stays}>
            <h4>{en ? 'Five bases: 2 + 2 + 1 + 1 + 1 nights' : '五處住宿，2＋2＋1＋1＋1 晚'}</h4>
            <ul>
              {calendar.stays.map((stay) => (
                <li key={stay.city}>
                  <strong>{en ? CITY_NAMES[stay.city] : stay.city}</strong>：<time dateTime={stay.checkIn}>{stay.checkIn}</time> {en ? 'check-in →' : '入住，'}
                  <time dateTime={stay.checkOut}>{stay.checkOut}</time> {en ? `check-out (${stay.nights} nights).` : `退房（${stay.nights} 晚）。`}
                </li>
              ))}
            </ul>
            <h4>{en ? 'Two overnight trains: no duplicate hotel booking' : '兩次車上過夜，不重訂酒店'}</h4>
            <ul>
              {calendar.overnightTransfers.map((transfer, index) => (
                <li key={transfer.route}>
                  <strong>{en ? ['Jakarta → Yogyakarta','Yogyakarta → Malang'][index] : transfer.route}</strong>：{transfer.nightDate} {en ? 'night →' : '夜間至'} {transfer.arrivalDate} {en ? 'morning; ticket date' : '清晨；目標票面日期'} {transfer.targetTicketDate}{en ? ' (verify actual departure).' : '（依實際出發時刻核對）。'}
                </li>
              ))}
            </ul>
            <p>{en ? 'For the second train, prefer departure after midnight and arrival in the morning: buy for the next calendar date. If unsuitable, use a daytime train and add the preceding hotel night. Do not book a second mountain room if the tour includes it. Dates are planning outputs, not confirmed bookings or inventory.' : '第二段優先凌晨出發、清晨抵達：零點後的車票要選下一個日期。夜車不合適可恢復白天車並補前晚酒店；山腳房若含在團費中不重訂。工具不查庫存，日期不代表已完成預訂。'}</p>
          </div>
        </>
      ) : null}
    </section>
  );
}
