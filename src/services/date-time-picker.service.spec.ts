import { TestBed } from '@angular/core/testing';

import { DateTimePickerService } from './date-time-picker.service';

describe('DateTimePickerService', () => {
  let service: DateTimePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateTimePickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
