import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowQuizzComponent } from './show-quizz.component';

describe('ShowQuizzComponent', () => {
  let component: ShowQuizzComponent;
  let fixture: ComponentFixture<ShowQuizzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowQuizzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowQuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
