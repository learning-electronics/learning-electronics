import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesassociateElementComponent } from './desassociate-element.component';

describe('DesassociateElementComponent', () => {
  let component: DesassociateElementComponent;
  let fixture: ComponentFixture<DesassociateElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesassociateElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesassociateElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
