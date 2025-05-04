import { TestBed } from '@angular/core/testing';

import { AvailableJobsService } from './available-jobs.service';

describe('AvailableJobsService', () => {
  let service: AvailableJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
