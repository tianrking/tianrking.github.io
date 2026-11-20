import {useState} from 'react';

export default function CameraTimingCalculator() {
  const [offset, setOffset] = useState(1);
  const [speed, setSpeed] = useState(300);
  const angle = (speed * Math.PI / 180) * offset / 1000;
  const displacement = 800 * Math.tan(angle);

  return (
    <fieldset className="camera-timing-calculator">
      <legend>試算時間偏移</legend>
      <label>
        相機與 IMU 的時間差 <span>{offset.toFixed(2)} ms</span>
        <input
          type="range"
          min="0"
          max="4"
          step="0.05"
          value={offset}
          onChange={(event) => setOffset(Number(event.target.value))}
        />
      </label>
      <label>
        相機角速度 <span>{speed}°/s</span>
        <input
          type="range"
          min="0"
          max="450"
          step="15"
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
        />
      </label>
      <output aria-live="polite">
        預估畫面中心位移 <strong>{displacement.toFixed(2)} px</strong>
      </output>
    </fieldset>
  );
}
