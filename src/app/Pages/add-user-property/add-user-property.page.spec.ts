import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserPropertyPage } from './add-user-property.page';

describe('AddUserPropertyPage', () => {
  let component: AddUserPropertyPage;
  let fixture: ComponentFixture<AddUserPropertyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserPropertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
