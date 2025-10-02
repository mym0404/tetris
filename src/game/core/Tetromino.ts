import { Scene } from 'phaser';
import type { TetrominoShape, TetrominoType } from '../types';
import { TETROMINOES } from '../types';
import type { GameBoard } from './GameBoard';

export class Tetromino {
  private type: TetrominoType;
  private shape: TetrominoShape;
  private color: number;
  private x: number;
  private y: number;
  private rotationIndex: number;
  private shapes: TetrominoShape[];
  private graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Scene, type: TetrominoType) {
    this.type = type;
    this.shapes = TETROMINOES[type].shapes;
    this.color = TETROMINOES[type].color;
    this.rotationIndex = 0;
    this.shape = this.shapes[this.rotationIndex];
    this.graphics = scene.add.graphics();

    // Start position: center top
    this.x = 3;
    this.y = -1;
  }

  rotate(clockwise: boolean = true): void {
    if (clockwise) {
      this.rotationIndex = (this.rotationIndex + 1) % this.shapes.length;
    } else {
      this.rotationIndex = (this.rotationIndex - 1 + this.shapes.length) % this.shapes.length;
    }

    this.shape = this.shapes[this.rotationIndex];
  }

  undoRotate(clockwise: boolean = true): void {
    if (clockwise) {
      this.rotationIndex = (this.rotationIndex - 1 + this.shapes.length) % this.shapes.length;
    } else {
      this.rotationIndex = (this.rotationIndex + 1) % this.shapes.length;
    }
    this.shape = this.shapes[this.rotationIndex];
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  undoMove(dx: number, dy: number): void {
    this.x -= dx;
    this.y -= dy;
  }

  getGhostPosition(board: GameBoard): number {
    let ghostY = this.y;

    while (board.isValidPosition(this.shape, this.x, ghostY + 1)) {
      ghostY++;
    }

    return ghostY;
  }

  render(board: GameBoard): void {
    this.graphics.clear();

    // Draw ghost piece
    const ghostY = this.getGhostPosition(board);
    this.drawShape(board, this.x, ghostY, 0.2);

    // Draw actual piece
    this.drawShape(board, this.x, this.y, 1.0);
  }

  private drawShape(board: GameBoard, x: number, y: number, alpha: number): void {
    const cellSize = board.getCellSize();
    const offsetX = board.getOffsetX();
    const offsetY = board.getOffsetY();
    const size = cellSize - 2;

    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (this.shape[row][col]) {
          const drawX = offsetX + (x + col) * cellSize;
          const drawY = offsetY + (y + row) * cellSize;

          // Only draw if within visible area
          if (y + row >= 0) {
            // Base color
            this.graphics.fillStyle(this.color, alpha);
            this.graphics.fillRect(drawX + 1, drawY + 1, size, size);

            if (alpha === 1.0) {
              // Gradient overlay for 3D effect
              this.graphics.fillGradientStyle(
                0xffffff,
                0xffffff,
                this.color,
                this.color,
                0.5,
                0.1,
                0.4,
                0.1,
              );
              this.graphics.fillRect(drawX + 1, drawY + 1, size, size);

              // Neon glow outer border
              this.graphics.lineStyle(3, this.color, 0.9);
              this.graphics.strokeRect(drawX + 1, drawY + 1, size, size);

              // Shimmer inner border
              this.graphics.lineStyle(1.5, 0xffffff, 0.7);
              this.graphics.strokeRect(drawX + 3, drawY + 3, size - 4, size - 4);
            } else {
              // Ghost piece - just faint glow
              this.graphics.lineStyle(2, this.color, alpha * 0.5);
              this.graphics.strokeRect(drawX + 1, drawY + 1, size, size);
            }
          }
        }
      }
    }
  }

  getShape(): TetrominoShape {
    return this.shape;
  }

  getColor(): number {
    return this.color;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getType(): TetrominoType {
    return this.type;
  }

  destroy(): void {
    this.graphics.destroy();
  }
}
