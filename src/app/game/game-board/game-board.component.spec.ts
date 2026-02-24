import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardComponent } from './game-board.component';
import { Cell, CellStatus } from '../models';
import { By } from '@angular/platform-browser';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;

  const mockCells: Cell[] = [
    { id: 1, status: CellStatus.IDLE },
    { id: 2, status: CellStatus.ACTIVE },
    { id: 3, status: CellStatus.SCORED }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('cells', mockCells);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of cells', () => {
    const cells = fixture.debugElement.queryAll(By.css('.game-board__cell'));
    expect(cells.length).toBe(3);
  });

  it('should emit cellClick when active cell is clicked', () => {
    spyOn(component.cellClick, 'emit');
    
    const activeCell = fixture.debugElement.query(By.css('.game-board__cell--active'));
    activeCell.triggerEventHandler('click', null);

    expect(component.cellClick.emit).toHaveBeenCalledWith(2);
  });

  it('should NOT emit cellClick when idle cell is clicked', () => {
    spyOn(component.cellClick, 'emit');
    
    // The first cell in mockCells is IDLE
    const idleCell = fixture.debugElement.queryAll(By.css('.game-board__cell'))[0];
    idleCell.triggerEventHandler('click', null);

    expect(component.cellClick.emit).not.toHaveBeenCalled();
  });
});
