import { Injectable, computed, signal } from '@angular/core';
import { BOARD_SIZE, WINNING_SCORE, Cell, GameStatus, CellStatus } from './models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  readonly cells = signal<Cell[]>(
    Array.from({ length: BOARD_SIZE }, (_, id) => ({ id, status: CellStatus.IDLE }))
  );
  readonly gameStatus = signal<GameStatus>(GameStatus.IDLE);
  readonly playerScore = computed(() => 
    this.cells().filter(c => c.status === CellStatus.SCORED).length
  );
  readonly computerScore = computed(() => 
    this.cells().filter(c => c.status === CellStatus.MISSED).length
  );

  private currentTimeoutId: number | null = null;
  private activeCellIndex: number | null = null;
  private timeLimit!: number;

  startGame(ms: number) {    
    this.timeLimit = ms;
    this.resetBoard();
    this.gameStatus.set(GameStatus.PLAYING);
    this.nextRound();
  }

  handleCellClick(index: number) {
    if (this.gameStatus() !== GameStatus.PLAYING) {
      return;
    }

    if (index === this.activeCellIndex) {
      this.handleSuccess(index);
    }
  }

  resetBoard() {
    this.clearTimer();
    this.gameStatus.set(GameStatus.IDLE);
    this.cells.set(
      Array.from({ length: BOARD_SIZE }, (_, id) => ({ id, status: CellStatus.IDLE }))
    );
    this.activeCellIndex = null;
  }

  private nextRound() {
    if (this.gameStatus() !== GameStatus.PLAYING) {
      return;
    }

    const availableCellIds = this.cells()
      .filter(cell => cell.status === CellStatus.IDLE)
      .map(cell => cell.id);

    if (availableCellIds.length === 0) {
      this.endGame();
      return;
    }

    const randomIdx = Math.floor(Math.random() * availableCellIds.length);
    // The board is a fixed range [0..BOARD_SIZE-1] initialized in order.
    // Thus, cell.id corresponds exactly to the array index.
    this.activeCellIndex = availableCellIds[randomIdx];

    this.updateCellStatus(this.activeCellIndex, CellStatus.ACTIVE);

    this.currentTimeoutId = window.setTimeout(() => {
      this.handleTimeout();
    }, this.timeLimit);
  }

  private handleSuccess(index: number) {
    this.clearTimer();
    this.updateCellStatus(index, CellStatus.SCORED);
    this.checkGameEnd();
  }

  private handleTimeout() {
    if (this.activeCellIndex !== null) {
      this.updateCellStatus(this.activeCellIndex, CellStatus.MISSED);
      this.checkGameEnd();
    }
  }

  private checkGameEnd() {
    this.activeCellIndex = null;
    this.currentTimeoutId = null; 

    const shouldEndGame = 
      this.playerScore() >= WINNING_SCORE 
      || this.computerScore() >= WINNING_SCORE;

    if (shouldEndGame) {
      this.endGame();
      return;
    }
    
    this.nextRound();
  }

  private endGame() {
    this.clearTimer();
    this.gameStatus.set(GameStatus.FINISHED);
    this.activeCellIndex = null;
  }

  private updateCellStatus(index: number, status: CellStatus) {
    this.cells.update(current => {
      const next = [...current];
      next[index] = { ...next[index], status };
      return next;
    });
  }

  private clearTimer() {
    if (this.currentTimeoutId) {
      clearTimeout(this.currentTimeoutId);
      this.currentTimeoutId = null;
    }
  }
}
