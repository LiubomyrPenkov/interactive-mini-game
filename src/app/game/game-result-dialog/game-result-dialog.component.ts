import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ScoreBoardComponent } from '../score-board/score-board.component';
import { WINNING_SCORE } from '../models';
import { GameResultData } from './game-result-dialog.models';

@Component({
  selector: 'app-game-result-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, MatButtonModule, ScoreBoardComponent],
  templateUrl: './game-result-dialog.component.html',
  styleUrl: './game-result-dialog.component.scss'
})
export class GameResultDialogComponent {
  readonly data = inject<GameResultData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<GameResultDialogComponent>);
  readonly WINNING_SCORE = WINNING_SCORE;

  close() {
    this.dialogRef.close();
  }
}
