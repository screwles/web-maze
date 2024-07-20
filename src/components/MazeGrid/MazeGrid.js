import React from 'react';
import './MazeGrid.css';

const MazeGrid = ({ grid, handleCellClick }) => {
  return (
    <div className="maze-grid">
      {grid.map((row, rowIndex) => (
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
    </div>
  );
};

export default MazeGrid;