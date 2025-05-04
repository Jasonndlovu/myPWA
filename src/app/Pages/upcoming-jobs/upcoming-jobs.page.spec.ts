import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpcomingJobsPage } from './upcoming-jobs.page';

describe('UpcomingJobsPage', () => {
  let component: UpcomingJobsPage;
  let fixture: ComponentFixture<UpcomingJobsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingJobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
