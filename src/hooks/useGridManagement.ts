import { useState, useCallback, useEffect } from 'react';
import type { GridData, Cell, MazeType } from '../types';
import { createGridData } from '../utils/gridUtils';
import {
  generateRecursiveDivision,
  generateRandomizedPrims,
  generateRandomWalls,
} from '../utils/mazeGeneration';

export const useGridManagement = (initialRows: number = 25, initialCols: number = 50) => {
  const [gridData, setGridData] = useState<GridData | null>(null);
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);

  const generateEmptyGrid = useCallback(() => {
    const newGridData = createGridData(rows, cols);
    setGridData(newGridData);
    return newGridData;
  }, [rows, cols]);

  const setWall = useCallback((row: number, col: number, isWall: boolean) => {
    if (!gridData) return;

    const cell = gridData.cells[row][col];
    if (cell.type === 'start' || cell.type === 'end') return;

    const newCells = [...gridData.cells];
    newCells[row] = newCells[row].map((c) => ({ ...c }));
    newCells[row][col].type = isWall ? 'wall' : 'empty';

    setGridData({
      ...gridData,
      cells: newCells,
    });
  }, [gridData]);

  const setStart = useCallback((row: number, col: number) => {
    if (!gridData) return;

    const cell = gridData.cells[row][col];
    if (cell.type === 'end') return;

    const oldStart = gridData.start;
    const newCells = [...gridData.cells];

    // Clone affected rows (may be the same row)
    const affectedRows = new Set([oldStart.row, row]);
    for (const r of affectedRows) {
      newCells[r] = newCells[r].map((c) => ({ ...c }));
    }

    newCells[oldStart.row][oldStart.col].type = 'empty';
    newCells[row][col].type = 'start';

    setGridData({
      ...gridData,
      cells: newCells,
      start: { row, col },
    });
  }, [gridData]);

  const setEnd = useCallback((row: number, col: number) => {
    if (!gridData) return;

    const cell = gridData.cells[row][col];
    if (cell.type === 'start') return;

    const oldEnd = gridData.end;
    const newCells = [...gridData.cells];

    const affectedRows = new Set([oldEnd.row, row]);
    for (const r of affectedRows) {
      newCells[r] = newCells[r].map((c) => ({ ...c }));
    }

    newCells[oldEnd.row][oldEnd.col].type = 'empty';
    newCells[row][col].type = 'end';

    setGridData({
      ...gridData,
      cells: newCells,
      end: { row, col },
    });
  }, [gridData]);

  const clearWalls = useCallback((): GridData | null => {
    if (!gridData) return null;

    const newCells = gridData.cells.map((rowArray) =>
      rowArray.map((c) => ({
        ...c,
        type: c.type === 'wall' ? 'empty' : c.type,
      } as Cell))
    );

    const newGridData = {
      ...gridData,
      cells: newCells,
    };
    setGridData(newGridData);
    return newGridData;
  }, [gridData]);

  const generateMaze = useCallback((type: MazeType): GridData => {
    let newGridData;
    if (type === 'recursive-division') {
      newGridData = generateRecursiveDivision(rows, cols);
    } else if (type === 'randomized-prims') {
      newGridData = generateRandomizedPrims(rows, cols);
    } else {
      newGridData = generateRandomWalls(rows, cols, 0.3);
    }
    setGridData(newGridData);
    return newGridData;
  }, [rows, cols]);

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
    generateMaze,
    setWall,
    setStart,
    setEnd,
    clearWalls,
  };
};
