import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailableJobsPage } from './available-jobs.page';

describe('AvailableJobsPage', () => {
  let component: AvailableJobsPage;
  let fixture: ComponentFixture<AvailableJobsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableJobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
