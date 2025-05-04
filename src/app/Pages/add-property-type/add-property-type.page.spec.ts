import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPropertyTypePage } from './add-property-type.page';

describe('AddPropertyTypePage', () => {
  let component: AddPropertyTypePage;
  let fixture: ComponentFixture<AddPropertyTypePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPropertyTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
