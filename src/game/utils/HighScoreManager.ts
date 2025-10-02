export interface HighScoreEntry {
  name: string;
  score: number;
  level: number;
  lines: number;
  date: string;
}

export class HighScoreManager {
  private static readonly STORAGE_KEY = 'tetris_high_scores';
  private static readonly MAX_SCORES = 10;

  static saveScore(score: number, level: number, lines: number, name: string = 'Player'): boolean {
    const scores = this.getHighScores();
    const newEntry: HighScoreEntry = {
      name,
      score,
      level,
      lines,
      date: new Date().toISOString(),
    };

    scores.push(newEntry);
    scores.sort((a, b) => b.score - a.score);
    scores.splice(this.MAX_SCORES);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
      return true;
    } catch (error) {
      console.error('Failed to save high score:', error);
      return false;
    }
  }

  static getHighScores(): HighScoreEntry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as HighScoreEntry[];
    } catch (error) {
      console.error('Failed to load high scores:', error);
      return [];
    }
  }

  static isHighScore(score: number): boolean {
    const scores = this.getHighScores();
    if (scores.length < this.MAX_SCORES) return true;
    return score > scores[scores.length - 1].score;
  }

  static getHighestScore(): number {
    const scores = this.getHighScores();
    return scores.length > 0 ? scores[0].score : 0;
  }

  static clearHighScores(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
