import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreBoardComponent } from './score-board.component';
import { By } from '@angular/platform-browser';

describe('ScoreBoardComponent', () => {
  let component: ScoreBoardComponent;
  let fixture: ComponentFixture<ScoreBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreBoardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreBoardComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('playerScore', 0);
    fixture.componentRef.setInput('computerScore', 0);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct scores', () => {
    fixture.componentRef.setInput('playerScore', 5);
    fixture.componentRef.setInput('computerScore', 3);
    fixture.detectChanges();

    const playerEl = fixture.debugElement.query(By.css('.score-board__item--player .score-board__value'));
    const computerEl = fixture.debugElement.query(By.css('.score-board__item--computer .score-board__value'));

    expect(playerEl.nativeElement.textContent).toContain('5');
    expect(computerEl.nativeElement.textContent).toContain('3');
  });
});
