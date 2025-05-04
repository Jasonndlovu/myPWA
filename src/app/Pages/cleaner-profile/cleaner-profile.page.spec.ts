import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CleanerProfilePage } from './cleaner-profile.page';

describe('CleanerProfilePage', () => {
  let component: CleanerProfilePage;
  let fixture: ComponentFixture<CleanerProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanerProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
