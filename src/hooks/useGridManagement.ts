import { useState, useCallback, useEffect } from 'react';
import type { GridData, Cell } from '../types';

export const useGridManagement = (initialRows: number = 25, initialCols: number = 50) => {
  const [gridData, setGridData] = useState<GridData | null>(null);
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);

  const generateEmptyGrid = useCallback(() => {
    const newCells: Cell[][] = [];

    for (let row = 0; row < rows; row++) {
      newCells[row] = [];
      for (let col = 0; col < cols; col++) {
        newCells[row][col] = {
          row,
          col,
          type: 'empty',
        };
      }
    }

    const startRow = Math.floor(rows / 2);
    const startCol = Math.floor(cols / 4);
    const endRow = Math.floor(rows / 2);
    const endCol = Math.floor((cols * 3) / 4);

    newCells[startRow][startCol].type = 'start';
    newCells[endRow][endCol].type = 'end';

    const newGridData: GridData = {
      rows,
      cols,
      cells: newCells,
      start: { row: startRow, col: startCol },
      end: { row: endRow, col: endCol },
    };

    setGridData(newGridData);
    return newGridData;
  }, [rows, cols]);

  const toggleWall = useCallback((row: number, col: number) => {
    if (!gridData) return;

    const cell = gridData.cells[row][col];
    if (cell.type === 'start' || cell.type === 'end') return;

    const newCells = gridData.cells.map((rowArray) =>
      rowArray.map((c) => ({ ...c }))
    );

    newCells[row][col].type = newCells[row][col].type === 'wall' ? 'empty' : 'wall';

    setGridData({
      ...gridData,
      cells: newCells,
    });
  }, [gridData]);

  const setStart = useCallback((row: number, col: number) => {
    if (!gridData) return;

    const newCells = gridData.cells.map((rowArray) =>
      rowArray.map((c) => ({ ...c }))
    );

    const oldStart = gridData.start;
    newCells[oldStart.row][oldStart.col].type = 'empty';

    if (newCells[row][col].type === 'end') return;

    newCells[row][col].type = 'start';

    setGridData({
      ...gridData,
      cells: newCells,
      start: { row, col },
    });
  }, [gridData]);

  const setEnd = useCallback((row: number, col: number) => {
    if (!gridData) return;

    const newCells = gridData.cells.map((rowArray) =>
      rowArray.map((c) => ({ ...c }))
    );

    const oldEnd = gridData.end;
    newCells[oldEnd.row][oldEnd.col].type = 'empty';

    if (newCells[row][col].type === 'start') return;

    newCells[row][col].type = 'end';

    setGridData({
      ...gridData,
      cells: newCells,
      end: { row, col },
    });
  }, [gridData]);

  const clearWalls = useCallback(() => {
    if (!gridData) return;

    const newCells = gridData.cells.map((rowArray) =>
      rowArray.map((c) => ({
        ...c,
        type: c.type === 'wall' ? 'empty' : c.type,
      } as Cell))
    );

    setGridData({
      ...gridData,
      cells: newCells,
    });
  }, [gridData]);

  useEffect(() => {
    generateEmptyGrid();
  }, [generateEmptyGrid]);

  return {
    gridData,
    rows,
    cols,
    setRows,
    setCols,
    setGridData,
    generateEmptyGrid,
    toggleWall,
    setStart,
    setEnd,
    clearWalls,
  };
};
