import { Component, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from './game.service';
import { GameBoardComponent } from './game-board/game-board.component';
import { ScoreBoardComponent } from './score-board/score-board.component';
import { GameControlsComponent } from './game-controls/game-controls.component';
import { GameStatus } from './models';
import { GameResultDialogComponent } from './game-result-dialog/game-result-dialog.component';

@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    GameBoardComponent, 
    ScoreBoardComponent, 
    GameControlsComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  private readonly gameService = inject(GameService);
  private readonly dialog = inject(MatDialog);

  readonly playerScore = this.gameService.playerScore;
  readonly computerScore = this.gameService.computerScore;
  readonly cells = this.gameService.cells;
  readonly gameStatus = this.gameService.gameStatus;
  readonly GameStatus = GameStatus;

  constructor() {
    effect(() => {
      if (this.gameService.gameStatus() === GameStatus.FINISHED) {
        this.openResultDialog();
        this.gameService.resetBoard();
      }
    });
  }

  onStart(ms: number) {
    this.gameService.startGame(ms);
  }

  onEnd() {
    this.gameService.resetBoard();
  }

  onCellClick(id: number) {
    this.gameService.handleCellClick(id);
  }

  private openResultDialog() {
    this.dialog
      .open(GameResultDialogComponent, {
        data: {
          playerScore: this.gameService.playerScore(),
          computerScore: this.gameService.computerScore()
        },
        width: '300px'
      });
  }
}
