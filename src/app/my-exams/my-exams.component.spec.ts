import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExamsComponent } from './my-exams.component';

describe('MyExamsComponent', () => {
  let component: MyExamsComponent;
  let fixture: ComponentFixture<MyExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyExamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
