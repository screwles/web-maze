import React, { useEffect, useState, useCallback, useMemo } from 'react';
import './Car.css';

const Car = ({ grid, entrance, exit, running, speed, cellSize }) => {
  const [position, setPosition] = useState(entrance);
  const [direction, setDirection] = useState('right');
  const [path, setPath] = useState([entrance]);

  const directions = useMemo(() => ['right', 'down', 'left', 'up'], []);
  
  const getNextPosition = useCallback((pos, dir) => {
    const [x, y] = pos;
    if (dir === 'right') return [x, y + 1];
    if (dir === 'down') return [x + 1, y];
    if (dir === 'left') return [x, y - 1];
    if (dir === 'up') return [x - 1, y];
  }, []);

  const isMovable = useCallback((pos) => {
    const [x, y] = pos;
    if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) {
      console.log('Position out of bounds:', pos);
      return false;
    }
    const cell = grid[x][y];
    console.log('Checking cell:', pos, 'Is wall:', cell.isWall);
    return !cell.isWall;
  }, [grid]);

  useEffect(() => {
    setPosition(entrance);
    setPath([entrance]);
    setDirection('right');
  }, [entrance]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      if (position[0] === exit[0] && position[1] === exit[1]) {
        console.log('Reached exit');
        clearInterval(interval);
        return;
      }

      const rightDirection = directions[(directions.indexOf(direction) + 1) % 4];
      let nextPos = getNextPosition(position, rightDirection);

      if (isMovable(nextPos)) {
        setDirection(rightDirection);
        setPosition(nextPos);
        setPath((prevPath) => [...prevPath, nextPos]);
      } else {
        nextPos = getNextPosition(position, direction);

        if (isMovable(nextPos)) {
          setPosition(nextPos);
          setPath((prevPath) => [...prevPath, nextPos]);
        } else {
          const leftDirection = directions[(directions.indexOf(direction) + 3) % 4];
          setDirection(leftDirection);
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [position, direction, grid, exit, running, speed, getNextPosition, isMovable, directions]);

  const pathPoints = path.map(([x, y]) => `${y * cellSize + cellSize/2},${x * cellSize + cellSize/2}`).join(' ');

  const rotationAngle = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  }[direction];

  return (
    <>
      <svg
        className="car"
        viewBox="0 0 100 100"
        style={{
          position: 'absolute',
          top: `${position[0] * cellSize}px`,
          left: `${position[1] * cellSize}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          transform: `rotate(${rotationAngle}deg)`,
          transition: `top ${speed / 1000}s, left ${speed / 1000}s, transform ${speed / 1000}s`,
        }}
      >
        <polygon points="50,0 0,100 100,100" fill="lightblue" />
      </svg>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <polyline points={pathPoints} className="path" />
      </svg>
    </>
  );
};

export default Car;