import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExercisesComponent } from './my-exercises.component';

describe('MyExercisesComponent', () => {
  let component: MyExercisesComponent;
  let fixture: ComponentFixture<MyExercisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyExercisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
