import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessengerPage } from './messenger.page';

describe('MessengerPage', () => {
  let component: MessengerPage;
  let fixture: ComponentFixture<MessengerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
