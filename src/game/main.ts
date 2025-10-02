import { Game as MainGame } from './scenes/Game';
import { Preloader } from './scenes/Preloader';
import { AUTO, Game } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 800,
  height: 700,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scene: [Preloader, MainGame],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
