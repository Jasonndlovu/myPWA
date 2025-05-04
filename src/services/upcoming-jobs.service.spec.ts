import { TestBed } from '@angular/core/testing';

import { UpcomingJobsService } from './upcoming-jobs.service';

describe('UpcomingJobsService', () => {
  let service: UpcomingJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpcomingJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
