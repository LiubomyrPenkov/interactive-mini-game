import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameControlsComponent } from './game-controls.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GameStatus } from '../models';

describe('GameControlsComponent', () => {
  let component: GameControlsComponent;
  let fixture: ComponentFixture<GameControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameControlsComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GameControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('timeControl validation', () => {
    it('should be invalid when empty', () => {
      component.timeControl.setValue(null);
      expect(component.timeControl.valid).toBeFalse();
      expect(component.timeControl.hasError('required')).toBeTrue();
    });

    it('should be invalid when value is below 100', () => {
      component.timeControl.setValue(50);
      expect(component.timeControl.valid).toBeFalse();
      expect(component.timeControl.hasError('min')).toBeTrue();
    });

    it('should be valid when value is 100 or above', () => {
      component.timeControl.setValue(100);
      expect(component.timeControl.valid).toBeTrue();
    });
  });

  describe('onStart', () => {
    it('should emit start event with valid time value', () => {
      spyOn(component.start, 'emit');
      component.timeControl.setValue(1000);

      const event = new Event('submit');
      spyOn(event, 'preventDefault');
      component.onStart(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.start.emit).toHaveBeenCalledWith(1000);
    });

    it('should not emit start event when value is invalid (below min)', () => {
      spyOn(component.start, 'emit');
      component.timeControl.setValue(50);

      component.onStart(new Event('submit'));

      expect(component.start.emit).not.toHaveBeenCalled();
      expect(component.timeControl.touched).toBeTrue();
    });

    it('should not emit start event when value is null', () => {
      spyOn(component.start, 'emit');
      component.timeControl.setValue(null);

      component.onStart(new Event('submit'));

      expect(component.start.emit).not.toHaveBeenCalled();
      expect(component.timeControl.touched).toBeTrue();
    });

    it('should submit via form element', () => {
      spyOn(component.start, 'emit');
      component.timeControl.setValue(500);
      fixture.detectChanges();

      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('submit', new Event('submit'));

      expect(component.start.emit).toHaveBeenCalledWith(500);
    });

    it('should emit start event when control is disabled (restart while playing)', () => {
      spyOn(component.start, 'emit');
      component.timeControl.setValue(1000);
      fixture.componentRef.setInput('gameStatus', GameStatus.PLAYING);
      fixture.detectChanges();

      expect(component.timeControl.disabled).toBeTrue();

      component.onStart(new Event('submit'));

      expect(component.start.emit).toHaveBeenCalledWith(1000);
    });
  });

  describe('onEnd', () => {
    it('should emit end event', () => {
      spyOn(component.end, 'emit');
      component.onEnd();
      expect(component.end.emit).toHaveBeenCalled();
    });
  });

  describe('gameStatus effect', () => {
    it('should disable timeControl when game is PLAYING', () => {
      fixture.componentRef.setInput('gameStatus', GameStatus.PLAYING);
      fixture.detectChanges();

      expect(component.timeControl.disabled).toBeTrue();
    });

    it('should reset and enable timeControl when game is FINISHED', () => {
      // First set to PLAYING to disable
      fixture.componentRef.setInput('gameStatus', GameStatus.PLAYING);
      fixture.detectChanges();
      expect(component.timeControl.disabled).toBeTrue();

      // Then set to FINISHED
      fixture.componentRef.setInput('gameStatus', GameStatus.FINISHED);
      fixture.detectChanges();

      expect(component.timeControl.value).toBeNull();
      expect(component.timeControl.enabled).toBeTrue();
    });

    it('should enable timeControl when game is IDLE', () => {
      // First disable by playing
      fixture.componentRef.setInput('gameStatus', GameStatus.PLAYING);
      fixture.detectChanges();

      // Then go to IDLE
      fixture.componentRef.setInput('gameStatus', GameStatus.IDLE);
      fixture.detectChanges();

      expect(component.timeControl.enabled).toBeTrue();
    });
  });

  describe('template rendering', () => {
    it('should show "Start Game" button when not playing', () => {
      fixture.componentRef.setInput('gameStatus', GameStatus.IDLE);
      fixture.detectChanges();

      const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitBtn.nativeElement.textContent.trim()).toBe('Start Game');
    });

    it('should show "Restart Game" button when playing', () => {
      fixture.componentRef.setInput('gameStatus', GameStatus.PLAYING);
      fixture.detectChanges();

      const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitBtn.nativeElement.textContent.trim()).toBe('Restart Game');
    });

    it('should show "End Game" button only when playing', () => {
      fixture.componentRef.setInput('gameStatus', GameStatus.IDLE);
      fixture.detectChanges();
      let endBtn = fixture.debugElement.query(By.css('.game-controls__button--danger'));
      expect(endBtn).toBeNull();

      fixture.componentRef.setInput('gameStatus', GameStatus.PLAYING);
      fixture.detectChanges();
      endBtn = fixture.debugElement.query(By.css('.game-controls__button--danger'));
      expect(endBtn).toBeTruthy();
    });

    it('should call onEnd when "End Game" button is clicked', () => {
      spyOn(component.end, 'emit');
      fixture.componentRef.setInput('gameStatus', GameStatus.PLAYING);
      fixture.detectChanges();

      const endBtn = fixture.debugElement.query(By.css('.game-controls__button--danger'));
      endBtn.triggerEventHandler('click', null);

      expect(component.end.emit).toHaveBeenCalled();
    });
  });
});
