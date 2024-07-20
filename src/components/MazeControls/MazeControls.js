import React from 'react';
import './MazeControls.css';

const MazeControls = ({ setSettingEntrance, setSettingExit, running, setRunning, speed, setSpeed }) => {
  return (
    <div className="controls">
      <button onClick={() => setSettingEntrance(true)}>Set Entrance</button>
      <button onClick={() => setSettingExit(true)}>Set Exit</button>
      <button onClick={() => {
        setRunning(!running);
        console.log('Running state changed to:', !running);
      }}>
        {running ? 'Stop' : 'Start'}
      </button>
      <label>
        Speed:
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          min="100"
          step="100"
        />
      </label>
    </div>
  );
};

export default MazeControls;