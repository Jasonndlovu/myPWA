import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyInformationPage } from './property-information.page';

describe('PropertyInformationPage', () => {
  let component: PropertyInformationPage;
  let fixture: ComponentFixture<PropertyInformationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
