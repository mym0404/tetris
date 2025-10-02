import { Scene } from 'phaser';
import type { Cell } from '../types';

export class GameBoard {
  private grid: Cell[][];
  private readonly COLS = 10;
  private readonly ROWS = 20;
  private readonly CELL_SIZE = 32;
  private graphics: Phaser.GameObjects.Graphics;
  private offsetX: number;
  private offsetY: number;

  constructor(scene: Scene, offsetX: number = 100, offsetY: number = 50) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.graphics = scene.add.graphics();
    this.grid = this.createEmptyGrid();
  }

  private createEmptyGrid(): Cell[][] {
    return Array(this.ROWS)
      .fill(null)
      .map(() =>
        Array(this.COLS)
          .fill(null)
          .map(() => ({ occupied: false, color: 0x000000 })),
      );
  }

  isValidPosition(shape: number[][], x: number, y: number): boolean {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const gridX = x + col;
          const gridY = y + row;

          // Check boundaries
          if (gridX < 0 || gridX >= this.COLS || gridY >= this.ROWS) {
            return false;
          }

          // Allow negative Y for spawn position
          if (gridY < 0) {
            continue;
          }

          // Check collision with existing blocks
          if (this.grid[gridY][gridX].occupied) {
            return false;
          }
        }
      }
    }
    return true;
  }

  lockTetromino(shape: number[][], x: number, y: number, color: number): void {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const gridX = x + col;
          const gridY = y + row;

          if (gridY >= 0 && gridY < this.ROWS && gridX >= 0 && gridX < this.COLS) {
            this.grid[gridY][gridX] = {
              occupied: true,
              color: color,
            };
          }
        }
      }
    }
  }

  clearLines(): number {
    let linesCleared = 0;
    const linesToClear: number[] = [];

    // Find full lines
    for (let row = 0; row < this.ROWS; row++) {
      if (this.grid[row].every((cell) => cell.occupied)) {
        linesToClear.push(row);
      }
    }

    // Clear lines from bottom to top
    for (const row of linesToClear.reverse()) {
      // Remove the line
      this.grid.splice(row, 1);
      // Add new empty line at top
      this.grid.unshift(
        Array(this.COLS)
          .fill(null)
          .map(() => ({ occupied: false, color: 0x000000 })),
      );
      linesCleared++;
    }

    return linesCleared;
  }

  checkGameOver(): boolean {
    // Check if any blocks in the top row are occupied
    return this.grid[0].some((cell) => cell.occupied);
  }

  render(): void {
    this.graphics.clear();

    // Draw grid lines
    this.graphics.lineStyle(1, 0x333333, 0.5);

    for (let row = 0; row <= this.ROWS; row++) {
      this.graphics.lineBetween(
        this.offsetX,
        this.offsetY + row * this.CELL_SIZE,
        this.offsetX + this.COLS * this.CELL_SIZE,
        this.offsetY + row * this.CELL_SIZE,
      );
    }

    for (let col = 0; col <= this.COLS; col++) {
      this.graphics.lineBetween(
        this.offsetX + col * this.CELL_SIZE,
        this.offsetY,
        this.offsetX + col * this.CELL_SIZE,
        this.offsetY + this.ROWS * this.CELL_SIZE,
      );
    }

    // Draw occupied cells
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        const cell = this.grid[row][col];
        if (cell.occupied) {
          this.drawCell(col, row, cell.color);
        }
      }
    }
  }

  drawCell(col: number, row: number, color: number, alpha: number = 1): void {
    const x = this.offsetX + col * this.CELL_SIZE;
    const y = this.offsetY + row * this.CELL_SIZE;
    const size = this.CELL_SIZE - 2;

    // Main color
    this.graphics.fillStyle(color, alpha);
    this.graphics.fillRect(x + 1, y + 1, size, size);

    // Gradient overlay using fillGradientStyle
    this.graphics.fillGradientStyle(
      0xffffff,
      0xffffff,
      color,
      color,
      alpha * 0.4,
      alpha * 0.1,
      alpha * 0.3,
      alpha * 0.1,
    );
    this.graphics.fillRect(x + 1, y + 1, size, size);

    // Neon glow border
    this.graphics.lineStyle(3, color, alpha * 0.8);
    this.graphics.strokeRect(x + 1, y + 1, size, size);

    // Inner bright border
    this.graphics.lineStyle(1, 0xffffff, alpha * 0.6);
    this.graphics.strokeRect(x + 3, y + 3, size - 4, size - 4);
  }

  getCellSize(): number {
    return this.CELL_SIZE;
  }

  getOffsetX(): number {
    return this.offsetX;
  }

  getOffsetY(): number {
    return this.offsetY;
  }

  getCols(): number {
    return this.COLS;
  }

  getRows(): number {
    return this.ROWS;
  }

  reset(): void {
    this.grid = this.createEmptyGrid();
    this.graphics.clear();
  }
}
