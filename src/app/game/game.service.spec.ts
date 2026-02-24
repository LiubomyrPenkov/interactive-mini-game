import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { GameStatus, CellStatus, WINNING_SCORE, BOARD_SIZE } from './models';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    jasmine.clock().install();
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  afterEach(() => {
    service.resetBoard();
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.gameStatus()).toBe(GameStatus.IDLE);
    expect(service.playerScore()).toBe(0);
    expect(service.computerScore()).toBe(0);
    expect(service.cells().every(cell => cell.status === CellStatus.IDLE)).toBeTrue();
    expect(service.cells().length).toBe(BOARD_SIZE);
  });

  describe('startGame', () => {
    it('should change status to PLAYING and activate a cell', () => {
      service.startGame(1000);

      expect(service.gameStatus()).toBe(GameStatus.PLAYING);

      const activeCells = service.cells().filter(c => c.status === CellStatus.ACTIVE);
      expect(activeCells.length).toBe(1);
    });
  });

  describe('Game Loop', () => {
    it('should increment player score on correct click', () => {
      service.startGame(1000);

      const activeIndex = getActiveCellIndex(service);

      service.handleCellClick(activeIndex);

      expect(service.playerScore()).toBe(1);
      expect(service.cells()[activeIndex].status).toBe(CellStatus.SCORED);
      
      // Should immediately start next round or check end game
      const newActive = service.cells().filter(c => c.status === CellStatus.ACTIVE);
      expect(newActive.length).toBe(1);
    });

    it('should increment computer score on timeout', () => {
      service.startGame(1000);

      const activeIndex = getActiveCellIndex(service);
      jasmine.clock().tick(1000);

      expect(service.computerScore()).toBe(1);
      expect(service.cells()[activeIndex].status).toBe(CellStatus.MISSED);
      
      // Should have started a new round
      const newActive = service.cells().filter(c => c.status === CellStatus.ACTIVE);
      expect(newActive.length).toBe(1);
    });

    it('should ignore clicks on non-active cells', () => {
      service.startGame(1000);

      const activeIndex = getActiveCellIndex(service);
      const wrongIndex = (activeIndex + 1) % BOARD_SIZE;

      service.handleCellClick(wrongIndex);
      
      expect(service.playerScore()).toBe(0);
      expect(service.cells()[activeIndex].status).toBe(CellStatus.ACTIVE);
    });
  });

  describe('Winning/Losing Conditions', () => {
    it('should end game when player reaches winning score', () => {
      service.startGame(1000);
      
      // Simulate WINNING_SCORE consecutive wins
      for (let i = 0; i < WINNING_SCORE; i++) {
        const activeIndex = getActiveCellIndex(service);
        service.handleCellClick(activeIndex);
      }

      expect(service.playerScore()).toBe(WINNING_SCORE);
      expect(service.gameStatus()).toBe(GameStatus.FINISHED);
      
      // No new active cells after finish
      const activeCount = service.cells().filter(c => c.status === CellStatus.ACTIVE).length;
      expect(activeCount).toBe(0);
    });

    it('should end game when computer reaches winning score', () => {
      service.startGame(1000);

      // Simulate WINNING_SCORE timeouts
      for (let i = 0; i < WINNING_SCORE; i++) {
        jasmine.clock().tick(1000);
      }

      expect(service.computerScore()).toBe(WINNING_SCORE);
      expect(service.gameStatus()).toBe(GameStatus.FINISHED);
    });
  });

  describe('resetBoard', () => {
    it('should reset state to IDLE', () => {
      service.startGame(1000);

      service.resetBoard();

      expect(service.gameStatus()).toBe(GameStatus.IDLE);
      expect(service.playerScore()).toBe(0);
      expect(service.computerScore()).toBe(0);
      
      const allIdle = service.cells().every(c => c.status === CellStatus.IDLE);
      expect(allIdle).toBeTrue();
    });
  });
});

function getActiveCellIndex(service: GameService): number {
  const index = service.cells().findIndex(c => c.status === CellStatus.ACTIVE);
  if (index === -1) {
    throw new Error('Expected an active cell, but none was found.');
  }

  return index;
}
