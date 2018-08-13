import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarShowsPage } from './car-shows.page';

describe('ShowsPage', () => {
  let component: CarShowsPage;
  let fixture: ComponentFixture<CarShowsPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CarShowsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarShowsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
