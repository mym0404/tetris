export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type TetrominoShape = number[][];

export interface Cell {
  occupied: boolean;
  color: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface TetrominoData {
  color: number;
  shapes: TetrominoShape[];
}

export const TETROMINO_COLORS: Record<TetrominoType, { primary: number; secondary: number }> = {
  I: { primary: 0x00ffff, secondary: 0x00aaff },
  O: { primary: 0xffff00, secondary: 0xffaa00 },
  T: { primary: 0xff00ff, secondary: 0xaa00ff },
  S: { primary: 0x00ff00, secondary: 0x00aa00 },
  Z: { primary: 0xff0000, secondary: 0xaa0000 },
  J: { primary: 0x0000ff, secondary: 0x0000aa },
  L: { primary: 0xffa500, secondary: 0xff6600 },
};

export const TETROMINOES: Record<TetrominoType, TetrominoData> = {
  I: {
    color: 0x00ffff,
    shapes: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
  },
  O: {
    color: 0xffff00,
    shapes: [
      [
        [1, 1],
        [1, 1],
      ],
    ],
  },
  T: {
    color: 0x800080,
    shapes: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  S: {
    color: 0x00ff00,
    shapes: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  Z: {
    color: 0xff0000,
    shapes: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
    ],
  },
  J: {
    color: 0x0000ff,
    shapes: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
    ],
  },
  L: {
    color: 0xffa500,
    shapes: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
};
