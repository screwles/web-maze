import React, { useEffect, useState } from 'react';

const Grid = ({ setGrid, setEntrance, setExit }) => {
  const size = 50;
  const [settingEntrance, setSettingEntrance] = useState(false);
  const [settingExit, setSettingExit] = useState(false);
  const [localGrid, setLocalGrid] = useState([]);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const initialGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({ isWall: true, isEntrance: false, isExit: false }))
    );

    generateMaze(initialGrid, 1, 1);
    setLocalGrid(initialGrid);
    setGrid(initialGrid);

    // Set default entrance and exit
    setEntrance([0, 1]);
    setExit([size - 1, size - 2]);
    initialGrid[0][1] = { ...initialGrid[0][1], isWall: false, isEntrance: true };
    initialGrid[size - 1][size - 2] = { ...initialGrid[size - 1][size - 2], isWall: false, isExit: true };
  };

  const generateMaze = (grid, x, y) => {
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
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
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleCellClick = (row, col) => {
    if (settingEntrance) {
      setEntrance([row, col]);
      setSettingEntrance(false);
      const newGrid = [...localGrid];
      newGrid[row][col] = { ...newGrid[row][col], isWall: false, isEntrance: true };
      setLocalGrid(newGrid);
      setGrid(newGrid);
    } else if (settingExit) {
      setExit([row, col]);
      setSettingExit(false);
      const newGrid = [...localGrid];
      newGrid[row][col] = { ...newGrid[row][col], isWall: false, isExit: true };
      setLocalGrid(newGrid);
      setGrid(newGrid);
    }
  };

  return (
    <>
      <button onClick={() => setSettingEntrance(true)}>Set Entrance</button>
      <button onClick={() => setSettingExit(true)}>Set Exit</button>
      <div style={{ position: 'relative', marginTop: '20px' }}>
        {localGrid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: cell.isWall ? 'black' : cell.isEntrance ? 'green' : cell.isExit ? 'red' : 'white',
                  border: '1px solid gray',
                  cursor: settingEntrance || settingExit ? 'pointer' : 'default',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Grid;