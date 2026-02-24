import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { GameService } from './game.service';
import { MatDialog } from '@angular/material/dialog';
import { GameStatus } from './models';
import { signal } from '@angular/core';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameServiceSpy: jasmine.SpyObj<GameService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    // Mock Service
    gameServiceSpy = jasmine.createSpyObj('GameService', ['startGame', 'handleCellClick'], {
      playerScore: signal(0),
      computerScore: signal(0),
      cells: signal([]),
      gameStatus: signal(GameStatus.IDLE)
    });

    // Mock Dialog
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        { provide: GameService, useValue: gameServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gameService.startGame when onStart is called', () => {
    component.onStart(1000);
    expect(gameServiceSpy.startGame).toHaveBeenCalledWith(1000);
  });

  it('should call gameService.handleCellClick when onCellClick is called', () => {
    component.onCellClick(5);
    expect(gameServiceSpy.handleCellClick).toHaveBeenCalledWith(5);
  });
});
