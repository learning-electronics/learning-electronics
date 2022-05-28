import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationExamComponent } from './delete-confirmation-exam.component';

describe('DeleteConfirmationExamComponent', () => {
  let component: DeleteConfirmationExamComponent;
  let fixture: ComponentFixture<DeleteConfirmationExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConfirmationExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmationExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
