import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CarShowsPage } from './car-shows.page';
import {
  CarShowsService,
  createCarShowsServiceMock,
  testCarShows
} from '../services/car-shows';
import { CarShow } from '../models/car-show';

describe('CarShowsPage', () => {
  let carShowsService;
  let component: CarShowsPage;
  let carShows: Array<CarShow>;
  let fixture: ComponentFixture<CarShowsPage>;

  beforeEach(async () => {
    carShows = [...testCarShows];
    carShowsService = createCarShowsServiceMock();
    carShowsService.getAll.and.returnValue(of(carShows));
    TestBed.configureTestingModule({
      declarations: [CarShowsPage],
      providers: [{ provide: CarShowsService, useValue: carShowsService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  describe('initialization', () => {
    it('gets the existing car shows', () => {
      expect(carShowsService.getAll).toHaveBeenCalledTimes(1);
    });

    it('assigns the returned shows', () => {
      expect(component.allCarShows).toEqual(testCarShows);
    });
  });

  describe('on car shows changed', () => {
    beforeEach(() => {
      carShowsService.getAll.calls.reset();
      component.allCarShows = [];
    });

    it('gets the existing car shows', () => {
      carShowsService.changed.next();
      expect(carShowsService.getAll).toHaveBeenCalledTimes(1);
    });

    it('assigns the returned shows', () => {
      carShowsService.changed.next();
      expect(component.allCarShows).toEqual(testCarShows);
    });
  });
});
