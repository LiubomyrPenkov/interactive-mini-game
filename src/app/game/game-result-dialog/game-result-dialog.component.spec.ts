import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameResultDialogComponent } from './game-result-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GameResultData } from './game-result-dialog.models';

describe('GameResultDialogComponent', () => {
  let component: GameResultDialogComponent;
  let fixture: ComponentFixture<GameResultDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<GameResultDialogComponent>>;

  const mockData: GameResultData = {
    playerScore: 10,
    computerScore: 5,
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [GameResultDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct data injected', () => {
    expect(component.data).toEqual(mockData);
  });

  it('should close dialog when close is called', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
