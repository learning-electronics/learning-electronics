import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedRegisterComponent } from './failed-register.component';

describe('FailedRegisterComponent', () => {
  let component: FailedRegisterComponent;
  let fixture: ComponentFixture<FailedRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
