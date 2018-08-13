import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotsPage } from './ballots.page';

describe('BallotsPage', () => {
  let component: BallotsPage;
  let fixture: ComponentFixture<BallotsPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BallotsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
