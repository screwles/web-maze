import React, { useState, useEffect, useCallback, useRef } from 'react';
import Car from './Car';
import './Maze.css';

const Maze = () => {
  const size = 50;
  const [entrance, setEntrance] = useState([0, 1]);
  const [exit, setExit] = useState([size - 1, size - 2]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [settingEntrance, setSettingEntrance] = useState(false);
  const [settingExit, setSettingExit] = useState(false);
  const mazeRef = useRef([]);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateMaze = useCallback((grid, x, y) => {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    shuffle(directions);

    grid[x][y].isWall = false;
    for (const [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && grid[nx][ny].isWall) {
        grid[x + dx][y + dy].isWall = false;
        generateMaze(grid, nx, ny);
      }
    }
  }, [size]);

  const initializeGrid = useCallback(() => {
    const initialGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({ isWall: true, isEntrance: false, isExit: false }))
    );

    generateMaze(initialGrid, 1, 1);

    initialGrid[entrance[0]][entrance[1]] = { isWall: false, isEntrance: true, isExit: false };
    initialGrid[exit[0]][exit[1]] = { isWall: false, isEntrance: false, isExit: true };

    mazeRef.current = initialGrid;
  }, [size, entrance, exit, generateMaze]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const handleCellClick = (row, col) => {
    if (settingEntrance) {
      setEntrance([row, col]);
      setSettingEntrance(false);
      const newGrid = [...mazeRef.current];
      newGrid[row][col] = { isWall: false, isEntrance: true, isExit: false };
      mazeRef.current = newGrid;
    } else if (settingExit) {
      setExit([row, col]);
      setSettingExit(false);
      const newGrid = [...mazeRef.current];
      newGrid[row][col] = { isWall: false, isEntrance: false, isExit: true };
      mazeRef.current = newGrid;
    }
  };

  return (
    <div className="maze-container">
      <h1>Maze</h1>
      <div className="controls">
        <button onClick={() => setSettingEntrance(true)}>Set Entrance</button>
        <button onClick={() => setSettingExit(true)}>Set Exit</button>
        <button onClick={() => setRunning(!running)}>{running ? 'Stop' : 'Start'}</button>
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
      <div className="maze-grid">
        {mazeRef.current.map((row, rowIndex) => (
          <div key={rowIndex} className="maze-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`maze-cell ${cell.isWall ? 'wall' : ''} ${cell.isEntrance ? 'entrance' : ''} ${cell.isExit ? 'exit' : ''}`}
              />
            ))}
          </div>
        ))}
        {mazeRef.current.length > 0 && (
          <Car grid={mazeRef.current} entrance={entrance} exit={exit} running={running} speed={speed} />
        )}
      </div>
    </div>
  );
};

export default Maze;
