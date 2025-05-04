import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptServicePage } from './accept-service.page';

describe('AcceptServicePage', () => {
  let component: AcceptServicePage;
  let fixture: ComponentFixture<AcceptServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
