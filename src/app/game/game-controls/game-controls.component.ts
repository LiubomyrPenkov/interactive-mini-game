import { Component, output, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { input } from '@angular/core';
import { GameStatus } from '../models';

@Component({
  selector: 'app-game-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss'
})
export class GameControlsComponent {
  readonly timeControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(100)
  ]);
  
  readonly gameStatus = input<GameStatus>();
  readonly start = output<number>();
  readonly end = output<void>();
  readonly GameStatus = GameStatus;

  constructor() {
    effect(() => {
      if (this.gameStatus() === GameStatus.PLAYING) {
        this.timeControl.disable();
        return;
      }

      if (this.gameStatus() === GameStatus.FINISHED) {
        this.timeControl.reset();
      }

      if (this.timeControl.disabled) {
        this.timeControl.enable();
      }
    });
  }

  onStart(event: Event): void {
    event.preventDefault();
    if (!this.timeControl.invalid && this.timeControl.value) {
      this.start.emit(this.timeControl.value);
    } else {
      this.timeControl.markAsTouched();
    }
  }

  onEnd(): void {
    this.end.emit();
  }
}
