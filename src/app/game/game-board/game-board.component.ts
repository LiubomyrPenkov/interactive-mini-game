import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Cell, CellStatus } from '../models';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
  readonly cells = input.required<Cell[]>();
  readonly cellClick = output<number>();

  handleCellClick(cell: Cell): void {
    if (cell.status !== CellStatus.ACTIVE) {
      return;
    }
    this.cellClick.emit(cell.id);
  }
}
