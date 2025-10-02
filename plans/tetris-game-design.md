# Tetris-Style Puzzle Game Design Document

## 1. Game Overview

### Basic Information
- **Genre**: Puzzle
- **Platform**: Mobile (Android/iOS) & PC (Web Browser)
- **Target Audience**: All ages
- **Game Objective**: Stack and clear blocks to achieve the highest score in a casual puzzle game

### Core Concept
Classic Tetris-style falling block puzzle game built with Phaser 3, featuring 7 types of tetrominoes with rotation and movement mechanics.

---

## 2. Core Game Rules

1. Random blocks (7 types of tetrominoes) fall from the top
2. Player can move blocks left/right and rotate them
3. Blocks lock in place when they touch the bottom or another block
4. When a horizontal line is completely filled, it is cleared and score increases
5. Game over when blocks stack up to the ceiling

---

## 3. Tetromino Definitions

### 7 Standard Tetrominoes

| Name | Shape | Color | Grid Size |
|------|-------|-------|-----------|
| I-Block | `████` | Cyan | 4x1 |
| O-Block | `██`<br>`██` | Yellow | 2x2 |
| T-Block | `███`<br>` █ ` | Purple | 3x2 |
| S-Block | ` ██`<br>`██ ` | Green | 3x2 |
| Z-Block | `██ `<br>` ██` | Red | 3x2 |
| J-Block | `█  `<br>`███` | Blue | 3x2 |
| L-Block | `  █`<br>`███` | Orange | 3x2 |

### Block Properties
- Each block consists of 4 cells
- Blocks can rotate 90° clockwise/counterclockwise
- Rotation point: center of the block (with wall kick implementation)
- Ghost piece: semi-transparent preview showing landing position

---

## 4. Control System

### Mobile Controls
| Action | Input |
|--------|-------|
| Move Left/Right | Horizontal swipe |
| Rotate | Tap |
| Soft Drop | Down swipe |
| Hard Drop | Down swipe (fast) |

### PC (Web) Controls
| Action | Input |
|--------|-------|
| Move Left | ← Arrow Key |
| Move Right | → Arrow Key |
| Rotate Clockwise | ↑ Arrow Key |
| Rotate Counter-clockwise | Z Key |
| Soft Drop | ↓ Arrow Key (hold) |
| Hard Drop | Space Bar |
| Pause | ESC or P |

---

## 5. Scoring System

### Line Clear Points
| Lines Cleared | Base Points | Name |
|---------------|-------------|------|
| 1 Line | 100 | Single |
| 2 Lines | 300 | Double |
| 3 Lines | 500 | Triple |
| 4 Lines | 800 | Tetris |

### Bonus Points
- **Soft Drop**: +1 point per cell
- **Hard Drop**: +2 points per cell
- **Combo Bonus**: Consecutive line clears multiply score by combo count (x2, x3, etc.)
- **Level Multiplier**: Final score = Base score × Current level

### Combo System
- Combo counter increases when clearing lines consecutively
- Combo breaks when a block lands without clearing any lines
- Display combo count with visual feedback (e.g., "COMBO x3!")

---

## 6. Level & Difficulty Progression

### Level System
- Start at Level 1
- Level up every 10 lines cleared
- Maximum level: 15

### Fall Speed by Level
```
Level 1-3:   1000ms per cell
Level 4-6:   700ms per cell
Level 7-9:   500ms per cell
Level 10-12: 300ms per cell
Level 13-15: 150ms per cell
```

### Difficulty Modifiers
- Higher levels = faster block descent
- Score multiplier increases with level
- Optional: Random garbage lines appear at higher levels (Level 10+)

---

## 7. Game Flow

### Scene Structure
```
Boot → Preloader → MainMenu → Game → GameOver
                      ↑________________|
```

### Game States
1. **Boot**: Initialize game engine
2. **Preloader**: Load all assets (blocks, sounds, UI)
3. **MainMenu**:
   - Start New Game
   - View High Scores
   - Settings (Sound, Controls)
4. **Game**: Active gameplay
   - Playing
   - Paused
5. **GameOver**:
   - Display final score
   - Show rank (if applicable)
   - Retry or Return to Menu

### Game Loop
```
1. Spawn new tetromino at top center
2. Update tetromino position (fall by gravity)
3. Process player input (move/rotate)
4. Check collision
5. Lock tetromino if grounded
6. Check for line clears
7. Clear lines and update score
8. Check game over condition
9. Repeat from step 1
```

---

## 8. UI/UX Design

### In-Game HUD
```
┌─────────────────────────────────────┐
│ SCORE: 12,450    LEVEL: 3   LINE: 28│
├──────────────┬──────────────────────┤
│              │                      │
│   NEXT       │   GAME BOARD         │
│   [Block]    │   (10 x 20 grid)     │
│              │                      │
│   HOLD       │                      │
│   [Block]    │                      │
│              │                      │
│              │                      │
│   ⏸ PAUSE    │                      │
└──────────────┴──────────────────────┘
```

### Visual Style Options
**Option 1: Retro Style**
- Pixel art blocks with thick borders
- CRT screen effect (optional scanlines)
- Vibrant neon colors
- 8-bit style fonts

**Option 2: Modern Minimal**
- Flat design with subtle gradients
- Clean, rounded blocks
- Pastel or monochrome color scheme
- Sans-serif fonts (e.g., Roboto, Inter)

### UI Components
- **Score Display**: Large, prominent numbers
- **Next Block Preview**: Shows upcoming 1-3 blocks
- **Hold Block**: Allow player to save one block for later use
- **Level Progress Bar**: Visual indicator of lines until next level
- **Pause Menu**: Resume, Restart, Settings, Quit
- **Particle Effects**: Line clear explosions, block landing dust

---

## 9. Sound Design

### Background Music (BGM)
- **Main Menu**: Calm, looping ambient track
- **Gameplay**:
  - Level 1-5: Upbeat, relaxed tempo
  - Level 6-10: Moderate tempo increase
  - Level 11+: High-energy, fast-paced
- **Game Over**: Melancholic but hopeful tune

### Sound Effects (SFX)
| Event | Sound Description |
|-------|-------------------|
| Block Move | Soft click |
| Block Rotate | Mechanical turn |
| Block Lock | Firm thud |
| Line Clear | Satisfying chime (pitch increases with more lines) |
| Tetris (4 lines) | Special fanfare |
| Level Up | Achievement bell |
| Game Over | Descending tone |
| Combo | Layered "ding" sounds |
| Hard Drop | Whoosh + impact |

### Audio Settings
- Master volume control
- Separate BGM and SFX volume sliders
- Mute toggle

---

## 10. Additional Features

### High Score System
- **Local Storage**: Save top 10 scores locally using `localStorage`
- **Leaderboard**: Display name, score, level, lines cleared
- **Data Format**:
  ```typescript
  interface HighScore {
    name: string;
    score: number;
    level: number;
    lines: number;
    date: string;
  }
  ```

### Pause Functionality
- Press ESC or P to pause
- Blur game board during pause
- Display pause menu overlay
- Options: Resume, Restart, Settings, Quit to Menu

### Hold Mechanism
- Press C or Shift to hold current block
- Swap current block with held block
- Can only hold once per block spawn (prevent infinite holds)
- Visual indicator for hold availability

### Ghost Piece
- Semi-transparent preview of landing position
- Same color as current block with 30% opacity
- Updates in real-time as block moves/rotates

### Responsive Design
- Auto-scale game board to fit screen size
- Maintain aspect ratio (e.g., 10:20 for board)
- Touch controls for mobile with on-screen buttons (optional)

---

## 11. Technical Implementation Guide

### Phaser Scene Architecture

#### Scenes
1. **Boot.ts**:
   - Initialize game configuration
   - Set up global variables

2. **Preloader.ts**:
   - Load sprite sheets for blocks
   - Load audio files
   - Display loading bar

3. **MainMenu.ts**:
   - Title screen with options
   - High score preview
   - Settings access

4. **Game.ts** (Main gameplay):
   - Game board rendering (10x20 grid)
   - Tetromino spawning and movement
   - Collision detection
   - Line clearing logic
   - Score calculation
   - Input handling

5. **GameOver.ts**:
   - Final score display
   - High score comparison
   - Retry/Menu options

### Core Game Components

#### 1. Grid System
```typescript
interface Cell {
  occupied: boolean;
  color: number; // Hex color
}

class GameBoard {
  private grid: Cell[][]; // 10 x 20
  private readonly COLS = 10;
  private readonly ROWS = 20;

  constructor() {
    this.grid = Array(this.ROWS).fill(null)
      .map(() => Array(this.COLS).fill({ occupied: false, color: 0x000000 }));
  }

  isValidPosition(tetromino: Tetromino, x: number, y: number): boolean;
  lockTetromino(tetromino: Tetromino): void;
  clearLines(): number; // Returns number of lines cleared
  checkGameOver(): boolean;
}
```

#### 2. Tetromino Class
```typescript
type TetrominoShape = number[][];

class Tetromino {
  private shape: TetrominoShape;
  private color: number;
  private x: number;
  private y: number;
  private type: string; // 'I', 'O', 'T', 'S', 'Z', 'J', 'L'

  rotate(clockwise: boolean): void;
  move(dx: number, dy: number): void;
  getGhostPosition(board: GameBoard): number; // Returns y position
}
```

#### 3. Input Manager
```typescript
class InputManager {
  private scene: Phaser.Scene;
  private keys: Map<string, Phaser.Input.Keyboard.Key>;

  setupKeyboard(): void;
  setupTouch(): void; // For mobile
  processInput(tetromino: Tetromino, board: GameBoard): void;
}
```

#### 4. Collision Detection
```typescript
class CollisionManager {
  checkCollision(tetromino: Tetromino, board: GameBoard): boolean;
  checkWallCollision(tetromino: Tetromino): boolean;
  checkFloorCollision(tetromino: Tetromino): boolean;
  checkBlockCollision(tetromino: Tetromino, board: GameBoard): boolean;
  wallKick(tetromino: Tetromino, board: GameBoard): boolean; // SRS wall kick system
}
```

#### 5. Scoring System
```typescript
class ScoreManager {
  private score: number = 0;
  private level: number = 1;
  private lines: number = 0;
  private combo: number = 0;

  addLineScore(linesCleared: number): void;
  addDropScore(distance: number, isHard: boolean): void;
  updateCombo(linesCleared: number): void;
  checkLevelUp(): void;
}
```

### Data Structures

#### Tetromino Shapes (Rotation States)
```typescript
const TETROMINOES = {
  I: {
    color: 0x00FFFF,
    shapes: [
      [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // 0°
      [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]], // 90°
      [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]], // 180°
      [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]  // 270°
    ]
  },
  O: {
    color: 0xFFFF00,
    shapes: [
      [[1,1], [1,1]] // No rotation needed
    ]
  },
  // ... (define all 7 tetrominoes)
};
```

### Game Loop Timing
```typescript
class Game extends Phaser.Scene {
  private fallTimer: number = 0;
  private fallInterval: number = 1000; // ms

  update(time: number, delta: number): void {
    this.fallTimer += delta;

    if (this.fallTimer >= this.fallInterval) {
      this.fallTimer = 0;
      this.moveTetrominoDown();
    }
  }

  updateFallSpeed(): void {
    // Adjust based on level
    this.fallInterval = Math.max(150, 1000 - (this.level * 50));
  }
}
```

### Rendering System
```typescript
class Renderer {
  private cellSize = 32; // pixels

  renderBoard(board: GameBoard): void;
  renderTetromino(tetromino: Tetromino): void;
  renderGhost(tetromino: Tetromino, ghostY: number): void;
  renderNextBlock(tetromino: Tetromino): void;
  renderHoldBlock(tetromino: Tetromino | null): void;
  renderParticles(x: number, y: number, type: string): void; // Line clear effects
}
```

---

## 12. Asset Requirements

### Graphics
- **Block Sprites**: 32x32px for each color (7 colors + border)
- **Background**: Gradient or pattern background for game board
- **UI Elements**:
  - Button sprites (Play, Pause, Resume, etc.)
  - Panel frames for score/next block areas
  - Icons (sound on/off, etc.)
- **Particle Effects**: Small colored squares for line clear animations

### Audio
- **BGM**: 3-4 looping tracks (90-140 BPM range)
- **SFX**: 10-12 short sound effects (WAV or OGG format)

### Fonts
- **Score Font**: Bold, easy-to-read (e.g., Press Start 2P for retro, Roboto for modern)
- **UI Font**: Clean sans-serif for menus

---

## 13. Development Task Checklist

### Phase 1: Core Mechanics (Foundation)
- [ ] Set up game board grid system (10x20)
- [ ] Implement Tetromino class with 7 shapes
- [ ] Create rotation system (basic + wall kick)
- [ ] Implement movement controls (left, right, down)
- [ ] Add collision detection (walls, floor, blocks)
- [ ] Implement block locking mechanism
- [ ] Create line clearing logic
- [ ] Add gravity/fall system with timing

### Phase 2: Scoring & Progression
- [ ] Implement scoring system (single, double, triple, tetris)
- [ ] Add combo system
- [ ] Create level progression logic
- [ ] Implement speed adjustment per level
- [ ] Add soft drop and hard drop with scoring

### Phase 3: UI/UX
- [ ] Design and implement HUD layout
- [ ] Add score, level, lines display
- [ ] Create next block preview panel
- [ ] Implement hold block system
- [ ] Add ghost piece visualization
- [ ] Create pause menu
- [ ] Design game over screen with stats

### Phase 4: Visual Polish
- [ ] Create/import block sprite assets
- [ ] Implement particle effects for line clears
- [ ] Add visual feedback for rotation/movement
- [ ] Create background graphics
- [ ] Add level-up animation
- [ ] Implement combo display effects

### Phase 5: Audio
- [ ] Add background music with volume control
- [ ] Implement SFX for all game events
- [ ] Create audio settings menu
- [ ] Ensure audio responsive to game state (pause, etc.)

### Phase 6: Input Systems
- [ ] Finalize keyboard controls for PC
- [ ] Implement touch controls for mobile
- [ ] Add input buffering for responsive controls
- [ ] Test and polish input latency

### Phase 7: Data Persistence
- [ ] Implement localStorage for high scores
- [ ] Create high score entry screen
- [ ] Build leaderboard display
- [ ] Add settings persistence (volume, controls)

### Phase 8: Testing & Optimization
- [ ] Test all tetromino rotations and wall kicks
- [ ] Verify scoring calculations
- [ ] Test edge cases (ceiling collision, multiple line clears)
- [ ] Optimize rendering performance
- [ ] Test on multiple screen sizes
- [ ] Mobile browser testing
- [ ] Cross-browser compatibility testing

### Phase 9: Polish & Launch
- [ ] Final UI/UX refinements
- [ ] Add tutorial/help screen
- [ ] Create main menu with settings
- [ ] Final audio mix and balance
- [ ] Performance profiling
- [ ] Build production version
- [ ] Deploy to web hosting

---

## 14. Future Enhancements (Post-MVP)

### Gameplay Features
- [ ] Marathon mode (endless play)
- [ ] Sprint mode (40 lines challenge)
- [ ] Time attack mode (2-minute speed run)
- [ ] Multiplayer (local or online)
- [ ] Custom themes/skins
- [ ] Power-ups (e.g., bomb block, line remover)

### Social Features
- [ ] Online leaderboard (Firebase/Supabase)
- [ ] Share score on social media
- [ ] Ghost data replay (watch your best runs)
- [ ] Achievement system

### Technical Improvements
- [ ] PWA support (installable web app)
- [ ] Offline mode
- [ ] Cloud save sync
- [ ] Advanced analytics (player behavior tracking)

---

## 15. Performance Considerations

### Optimization Targets
- **Frame Rate**: Maintain 60 FPS
- **Memory**: < 50MB RAM usage
- **Load Time**: < 3 seconds initial load
- **Input Lag**: < 16ms response time

### Best Practices
- Use object pooling for particles
- Minimize DOM manipulations (use Phaser canvas rendering)
- Optimize audio with sprite sheets
- Lazy load non-essential assets
- Use requestAnimationFrame for smooth animations
- Throttle touch event handlers on mobile

---

## 16. Testing Strategy

### Unit Tests
- Tetromino rotation logic
- Collision detection algorithms
- Score calculation functions
- Line clearing logic

### Integration Tests
- Scene transitions
- Input handling pipeline
- Audio playback synchronization
- localStorage operations

### User Testing
- Playability on different devices
- Control responsiveness
- Difficulty curve balance
- UI clarity and readability

---

## 17. References & Resources

### Tetris Guidelines
- [Tetris Guideline (Official Specifications)](https://tetris.wiki/Tetris_Guideline)
- [Super Rotation System (SRS)](https://tetris.wiki/Super_Rotation_System)
- [Tetris Scoring Systems](https://tetris.wiki/Scoring)

### Phaser 3 Documentation
- [Phaser 3 API Docs](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [Phaser Scene Management](https://phaser.io/tutorials/making-your-first-phaser-3-game)

### Assets & Tools
- [OpenGameArt](https://opengameart.org/) - Free game assets
- [Freesound](https://freesound.org/) - Sound effects
- [Aseprite](https://www.aseprite.org/) - Pixel art creation
- [Tiled](https://www.mapeditor.org/) - Grid-based level design

---

## Conclusion

This design document provides a comprehensive blueprint for implementing a Tetris-style puzzle game using Phaser 3. The specification covers all core mechanics, UI/UX design, technical architecture, and development phases.

**Next Steps**:
1. Review and approve this design document
2. Set up development environment
3. Create task list from Phase 1 checklist
4. Begin implementation starting with core game board and tetromino system

**Estimated Development Time**: 4-6 weeks for MVP (solo developer)

**Target Completion**: Complete Phases 1-7, with Phase 8-9 for polish before release
