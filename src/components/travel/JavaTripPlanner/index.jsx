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
    ? `Indonesia: 10 days, ${calendar.hotelNights} hotel nights and ${calendar.trainNights} overnight trains. Singapore overnight is separate. ${calendar.alerts.length ? `${calendar.alerts.length} closure or prayer reminders: check the corresponding days.` : 'Confirm actual train times, availability and temporary opening notices.'}`
    : invalid ? `Choose a valid departure date no later than ${MAX_START_DATE}.` : 'Choose the D1 departure date to see dates and stays.') : ready
    ? `印尼段 10 天、${calendar.hotelNights} 晚酒店＋${calendar.trainNights} 晚夜火車；新加坡一晚另計。${calendar.alerts.length ? `有 ${calendar.alerts.length} 項閉館或禮拜提醒，請查看對應日期。` : '列車時間、餘票與臨時開放仍須核對。'}`
    : invalid ? calendar.error : '選擇 D1 廣州出發日期，即可查看完整日期與住宿區間。';

  return (
    <section className={styles.planner} aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{en ? 'Indonesia calendar: seven hotel nights, two night trains' : '印尼十天日曆：七晚酒店、兩晚夜火車'}</h3>
      <p className={styles.intro} id={`${id}-help`}>
        {en ? 'Protect Borobudur structure access on 3 Nov and Prambanan on 4 Nov. The template provisionally follows the earlier 30 Oct departure / 31 Oct arrival record; confirm arrival and the hotel hold against the ticket. Changing D1 shifts the template, not flight bookings or the fixed dates in the article. No live inventory, weather or volcano access is checked.' : '保留 11/03 婆羅浮屠登塔、11/04 普蘭巴南必去。模板暫按原記錄 10/30 出發、10/31 抵達，落地與首晚房保留仍須核對機票。改 D1 只平移模板，不改機票或正文固定日期，也不查即時庫存、天氣或火山開放。'}
      </p>
      <div className={styles.controls}>
        <label htmlFor={`${id}-date`}>{en ? 'D1 departure date' : 'D1 出發日期'}</label>
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
                <p className={styles.night}>{en ? (day.overnight ? `Overnight train: ${DAY_CITIES[day.day - 1]} (not booked)` : day.stay ? `Stay: ${CITY_NAMES[day.stay]}` : 'Leave Indonesia; arrange one Singapore night separately') : day.overnight ? `車上過夜：${day.overnight}（待訂）` : day.stay ? `住宿：${day.stay}` : '離開印尼；另確認新加坡一晚住宿'}</p>
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
          <p>{en ? 'Issued onward dates stay fixed when this template shifts: 8 Nov SQ929 19:10 SUB T2 → 22:30 SIN; 9 Nov SQ8670 / Scoot TR982 16:00 SIN T1 → 20:35 HKG T1. Singapore offers a short morning, with T1 return before 13:00.' : '平移模板不改已出票後續航段：11/08 SQ929 19:10 SUB T2 → 22:30 SIN；11/09 SQ8670／酷航 TR982 16:00 SIN T1 → 20:35 HKG T1。新加坡只排上午短遊，13:00 前回 T1。'} <a href="#singapore-stopover">{en ? 'Singapore details →' : '新加坡銜接詳情 →'}</a></p>
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
