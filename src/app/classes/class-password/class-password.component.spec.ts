import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPasswordComponent } from './class-password.component';

describe('ClassPasswordComponent', () => {
  let component: ClassPasswordComponent;
  let fixture: ComponentFixture<ClassPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
