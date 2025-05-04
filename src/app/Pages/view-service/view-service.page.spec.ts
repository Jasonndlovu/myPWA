import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewtServicePage } from './view-service.page';

describe('ViewServicePage', () => {
  let component: ViewtServicePage;
  let fixture: ComponentFixture<ViewtServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
