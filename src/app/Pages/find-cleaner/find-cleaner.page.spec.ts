import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindCleanerPage } from './find-cleaner.page';

describe('FindCleanerPage', () => {
  let component: FindCleanerPage;
  let fixture: ComponentFixture<FindCleanerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FindCleanerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
