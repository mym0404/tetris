import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameBoard } from '../core/GameBoard';
import { Tetromino } from '../core/Tetromino';
import type { TetrominoType } from '../types';
import { HighScoreManager } from '../utils/HighScoreManager';

export class Game extends Scene {
  private camera: Phaser.Cameras.Scene2D.Camera;
  private board: GameBoard;
  private currentPiece: Tetromino | null = null;
  private nextPiece: Tetromino | null = null;
  private holdPiece: Tetromino | null = null;
  private canHold: boolean = true;
  private keys: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
    shift: Phaser.Input.Keyboard.Key;
    c: Phaser.Input.Keyboard.Key;
    p: Phaser.Input.Keyboard.Key;
    esc: Phaser.Input.Keyboard.Key;
  };
  private fallTimer: number = 0;
  private fallInterval: number = 1000;
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  private score: number = 0;
  private level: number = 1;
  private lines: number = 0;
  private combo: number = 0;
  private highScore: number = 0;
  private scoreText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private linesText: Phaser.GameObjects.Text;
  private comboText: Phaser.GameObjects.Text;
  private highScoreText: Phaser.GameObjects.Text;
  private nextPieceGraphics: Phaser.GameObjects.Graphics;
  private holdPieceGraphics: Phaser.GameObjects.Graphics;
  private pauseText: Phaser.GameObjects.Text | null = null;
  private moveDelay: number = 100;
  private lastMoveTime: number = 0;

  constructor() {
    super('Game');
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x1a1a2e);

    // Reset game state
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.fallTimer = 0;
    this.fallInterval = 1000;
    this.lastMoveTime = 0;
    this.currentPiece = null;
    this.nextPiece = null;
    this.holdPiece = null;
    this.canHold = true;
    this.highScore = HighScoreManager.getHighestScore();

    // Initialize game board
    this.board = new GameBoard(this, 50, 50);

    // Setup input
    this.keys = {
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      space: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      shift: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      c: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      p: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P),
      esc: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };

    // Create UI elements
    this.createUI();

    // Setup touch input for mobile
    this.setupTouchControls();

    // Spawn first piece
    this.spawnNewPiece();

    EventBus.emit('current-scene-ready', this);
  }

  private createUI(): void {
    const uiX = 400;

    // High score display
    this.highScoreText = this.add
      .text(uiX, 60, `HIGH SCORE: ${this.highScore}`, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffaa00',
      })
      .setOrigin(0, 0);

    // Score display
    this.scoreText = this.add
      .text(uiX, 90, `SCORE: ${this.score}`, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0, 0);

    // Level display
    this.levelText = this.add
      .text(uiX, 130, `LEVEL: ${this.level}`, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#00ffff',
      })
      .setOrigin(0, 0);

    // Lines display
    this.linesText = this.add
      .text(uiX, 160, `LINES: ${this.lines}`, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#00ff00',
      })
      .setOrigin(0, 0);

    // Combo display
    this.comboText = this.add
      .text(uiX, 190, '', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ff00ff',
      })
      .setOrigin(0, 0);

    // Next piece
    this.add
      .text(uiX, 240, 'NEXT:', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0, 0);

    this.nextPieceGraphics = this.add.graphics();

    // Hold piece
    this.add
      .text(uiX, 360, 'HOLD (C/Shift):', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0, 0);

    this.holdPieceGraphics = this.add.graphics();

    // Controls info
    this.add
      .text(
        uiX,
        500,
        'CONTROLS:\n← →: Move\n↑: Rotate\n↓: Soft Drop\nSPACE: Hard Drop\nP/ESC: Pause\nR: Restart',
        {
          fontFamily: 'Arial',
          fontSize: '14px',
          color: '#aaaaaa',
          lineSpacing: 4,
        },
      )
      .setOrigin(0, 0);
  }

  private setupTouchControls(): void {
    // Add touch zones for mobile
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Left zone
    const leftZone = this.add
      .rectangle(0, 0, gameWidth / 4, gameHeight, 0x000000, 0.01)
      .setOrigin(0, 0)
      .setInteractive();
    leftZone.on('pointerdown', () => this.moveLeft());

    // Right zone
    const rightZone = this.add
      .rectangle(gameWidth / 4, 0, gameWidth / 4, gameHeight, 0x000000, 0.01)
      .setOrigin(0, 0)
      .setInteractive();
    rightZone.on('pointerdown', () => this.moveRight());

    // Rotate zone (center top)
    const rotateZone = this.add
      .rectangle(gameWidth / 2, 0, gameWidth / 4, gameHeight / 2, 0x000000, 0.01)
      .setOrigin(0, 0)
      .setInteractive();
    rotateZone.on('pointerdown', () => this.rotatePiece());

    // Drop zone (center bottom)
    const dropZone = this.add
      .rectangle(gameWidth / 2, gameHeight / 2, gameWidth / 4, gameHeight / 2, 0x000000, 0.01)
      .setOrigin(0, 0)
      .setInteractive();
    dropZone.on('pointerdown', () => this.hardDrop());
  }

  private getRandomTetrominoType(): TetrominoType {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private spawnNewPiece(): void {
    if (this.currentPiece) {
      this.currentPiece.destroy();
    }

    if (this.nextPiece) {
      this.currentPiece = this.nextPiece;
    } else {
      this.currentPiece = new Tetromino(this, this.getRandomTetrominoType());
    }

    this.nextPiece = new Tetromino(this, this.getRandomTetrominoType());

    // Check if game over
    if (
      !this.board.isValidPosition(
        this.currentPiece.getShape(),
        this.currentPiece.getX(),
        this.currentPiece.getY(),
      )
    ) {
      this.gameOver();
    }
  }

  private gameOver(): void {
    this.isGameOver = true;

    // Save high score
    const isNewHighScore = HighScoreManager.isHighScore(this.score);
    if (this.score > 0) {
      HighScoreManager.saveScore(this.score, this.level, this.lines);
    }

    const gameOverText = isNewHighScore ? 'NEW HIGH SCORE!\n\nGAME OVER' : 'GAME OVER';

    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.8);
    panel.fillRect(this.cameras.main.centerX - 200, this.cameras.main.centerY - 150, 400, 300);

    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY - 80, gameOverText, {
        fontFamily: 'Arial',
        fontSize: isNewHighScore ? '36px' : '48px',
        color: isNewHighScore ? '#ffaa00' : '#ff0000',
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        `Score: ${this.score}\nLevel: ${this.level}\nLines: ${this.lines}`,
        {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#ffffff',
          align: 'center',
          lineSpacing: 8,
        },
      )
      .setOrigin(0.5);

    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Press R to Restart', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#aaaaaa',
        align: 'center',
      })
      .setOrigin(0.5);

    // Add restart key
    this.input.keyboard!.once('keydown-R', () => {
      this.scene.restart();
    });
  }

  private moveLeft(): void {
    if (!this.currentPiece || this.isGameOver) return;

    this.currentPiece.move(-1, 0);
    if (
      !this.board.isValidPosition(
        this.currentPiece.getShape(),
        this.currentPiece.getX(),
        this.currentPiece.getY(),
      )
    ) {
      this.currentPiece.undoMove(-1, 0);
    }
  }

  private moveRight(): void {
    if (!this.currentPiece || this.isGameOver) return;

    this.currentPiece.move(1, 0);
    if (
      !this.board.isValidPosition(
        this.currentPiece.getShape(),
        this.currentPiece.getX(),
        this.currentPiece.getY(),
      )
    ) {
      this.currentPiece.undoMove(1, 0);
    }
  }

  private moveDown(): void {
    if (!this.currentPiece || this.isGameOver) return;

    this.currentPiece.move(0, 1);
    if (
      !this.board.isValidPosition(
        this.currentPiece.getShape(),
        this.currentPiece.getX(),
        this.currentPiece.getY(),
      )
    ) {
      this.currentPiece.undoMove(0, 1);
      this.lockPiece();
    } else {
      this.score += 1; // Soft drop bonus
      this.updateUI();
    }
  }

  private rotatePiece(): void {
    if (!this.currentPiece || this.isGameOver) return;

    this.currentPiece.rotate(true);
    if (
      !this.board.isValidPosition(
        this.currentPiece.getShape(),
        this.currentPiece.getX(),
        this.currentPiece.getY(),
      )
    ) {
      // Try wall kick
      const kicks = [
        [1, 0],
        [-1, 0],
        [0, -1],
      ];
      let kicked = false;

      for (const [dx, dy] of kicks) {
        this.currentPiece.move(dx, dy);
        if (
          this.board.isValidPosition(
            this.currentPiece.getShape(),
            this.currentPiece.getX(),
            this.currentPiece.getY(),
          )
        ) {
          kicked = true;
          break;
        }
        this.currentPiece.undoMove(dx, dy);
      }

      if (!kicked) {
        this.currentPiece.undoRotate(true);
      }
    }
  }

  private hardDrop(): void {
    if (!this.currentPiece || this.isGameOver) return;

    const ghostY = this.currentPiece.getGhostPosition(this.board);
    const distance = ghostY - this.currentPiece.getY();
    this.score += distance * 2; // Hard drop bonus

    this.currentPiece.move(0, distance);
    this.lockPiece();
    this.updateUI();
  }

  private lockPiece(): void {
    if (!this.currentPiece) return;

    this.board.lockTetromino(
      this.currentPiece.getShape(),
      this.currentPiece.getX(),
      this.currentPiece.getY(),
      this.currentPiece.getColor(),
    );

    // Clear lines
    const linesCleared = this.board.clearLines();
    if (linesCleared > 0) {
      this.lines += linesCleared;
      this.combo++;
      this.updateScore(linesCleared);
      this.checkLevelUp();
      this.createLineClearEffect();
    } else {
      this.combo = 0;
    }

    // Allow hold again
    this.canHold = true;

    // Spawn new piece
    this.spawnNewPiece();
    this.fallTimer = 0;
  }

  private updateScore(linesCleared: number): void {
    const baseScores = [0, 100, 300, 500, 800];
    let score = baseScores[linesCleared] * this.level;

    // Combo multiplier
    if (this.combo > 1) {
      score *= this.combo;
    }

    this.score += score;

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }

    this.updateUI();
  }

  private createLineClearEffect(): void {
    // Create particle effect for line clear
    const centerX = this.board.getOffsetX() + (this.board.getCols() * this.board.getCellSize()) / 2;
    const centerY = this.cameras.main.centerY;

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 100 + Math.random() * 100;

      const graphics = this.add.graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      graphics.fillStyle(color, 1);
      graphics.fillCircle(0, 0, 4);

      graphics.setPosition(centerX, centerY);

      this.tweens.add({
        targets: graphics,
        x: centerX + Math.cos(angle) * speed,
        y: centerY + Math.sin(angle) * speed,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => graphics.destroy(),
      });
    }

    // Show combo text
    if (this.combo > 1) {
      const comboTextObj = this.add
        .text(centerX, centerY - 50, `COMBO x${this.combo}!`, {
          fontFamily: 'Arial',
          fontSize: '32px',
          color: '#ff00ff',
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: comboTextObj,
        y: centerY - 100,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => comboTextObj.destroy(),
      });
    }
  }

  private holdCurrentPiece(): void {
    if (!this.currentPiece || !this.canHold || this.isGameOver) return;

    const currentType = this.currentPiece.getType();
    this.currentPiece.destroy();

    if (this.holdPiece) {
      const holdType = this.holdPiece.getType();
      this.holdPiece.destroy();
      this.currentPiece = new Tetromino(this, holdType);
      this.holdPiece = new Tetromino(this, currentType);
    } else {
      this.holdPiece = new Tetromino(this, currentType);
      this.spawnNewPiece();
    }

    this.canHold = false;
    this.renderHoldPiece();
  }

  private togglePause(): void {
    if (this.isGameOver) return;

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.pauseText = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          'PAUSED\nPress P or ESC to Resume',
          {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#000000aa',
            padding: { x: 20, y: 20 },
          },
        )
        .setOrigin(0.5);
    } else if (this.pauseText) {
      this.pauseText.destroy();
      this.pauseText = null;
    }
  }

  private checkLevelUp(): void {
    const newLevel = Math.floor(this.lines / 10) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.fallInterval = Math.max(150, 1000 - this.level * 50);
    }
  }

  private updateUI(): void {
    this.scoreText.setText(`SCORE: ${this.score}`);
    this.levelText.setText(`LEVEL: ${this.level}`);
    this.linesText.setText(`LINES: ${this.lines}`);
    this.highScoreText.setText(`HIGH SCORE: ${this.highScore}`);

    if (this.combo > 1) {
      this.comboText.setText(`COMBO x${this.combo}!`);
    } else {
      this.comboText.setText('');
    }
  }

  private renderNextPiece(): void {
    this.nextPieceGraphics.clear();

    if (!this.nextPiece) return;

    const shape = this.nextPiece.getShape();
    const color = this.nextPiece.getColor();
    const cellSize = 20;
    const startX = 420;
    const startY = 270;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = startX + col * cellSize;
          const y = startY + row * cellSize;

          this.nextPieceGraphics.fillStyle(color, 1);
          this.nextPieceGraphics.fillRect(x, y, cellSize - 2, cellSize - 2);
          this.nextPieceGraphics.lineStyle(1, 0xffffff, 0.3);
          this.nextPieceGraphics.strokeRect(x, y, cellSize - 2, cellSize - 2);
        }
      }
    }
  }

  private renderHoldPiece(): void {
    this.holdPieceGraphics.clear();

    if (!this.holdPiece) return;

    const shape = this.holdPiece.getShape();
    const color = this.holdPiece.getColor();
    const cellSize = 20;
    const startX = 420;
    const startY = 390;
    const alpha = this.canHold ? 1.0 : 0.3;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = startX + col * cellSize;
          const y = startY + row * cellSize;

          this.holdPieceGraphics.fillStyle(color, alpha);
          this.holdPieceGraphics.fillRect(x, y, cellSize - 2, cellSize - 2);
          this.holdPieceGraphics.lineStyle(1, 0xffffff, alpha * 0.3);
          this.holdPieceGraphics.strokeRect(x, y, cellSize - 2, cellSize - 2);
        }
      }
    }
  }

  update(time: number, delta: number): void {
    if (this.isGameOver) return;

    // Pause toggle
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.p) ||
      Phaser.Input.Keyboard.JustDown(this.keys.esc)
    ) {
      this.togglePause();
    }

    if (this.isPaused) return;

    // Hold piece
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.c) ||
      Phaser.Input.Keyboard.JustDown(this.keys.shift)
    ) {
      this.holdCurrentPiece();
    }

    // Handle input with delay
    const currentTime = time;
    if (currentTime - this.lastMoveTime > this.moveDelay) {
      if (this.keys.left.isDown) {
        this.moveLeft();
        this.lastMoveTime = currentTime;
      } else if (this.keys.right.isDown) {
        this.moveRight();
        this.lastMoveTime = currentTime;
      }

      if (this.keys.down.isDown) {
        this.moveDown();
        this.lastMoveTime = currentTime;
      }
    }

    // Rotation (single press)
    if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
      this.rotatePiece();
    }

    // Hard drop (single press)
    if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      this.hardDrop();
    }

    // Auto fall
    this.fallTimer += delta;
    if (this.fallTimer >= this.fallInterval) {
      this.fallTimer = 0;
      this.moveDown();
    }

    // Render
    this.board.render();
    if (this.currentPiece) {
      this.currentPiece.render(this.board);
    }
    this.renderNextPiece();
    this.renderHoldPiece();
  }
}
