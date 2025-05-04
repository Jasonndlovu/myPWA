import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptJobPage } from './accept-job.page';

describe('AcceptJobPage', () => {
  let component: AcceptJobPage;
  let fixture: ComponentFixture<AcceptJobPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
