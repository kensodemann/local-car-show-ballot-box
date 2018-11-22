import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarShowsPage } from './car-shows.page';
import {
  CarShowsService,
  createCarShowsServiceMock,
  testCarShowsOld
} from '../services/car-shows';
import { CarShow } from '../models/car-show';
import { deepCopy } from '../../../test/util';

describe('CarShowsPage', () => {
  let carShowsService;
  let component: CarShowsPage;
  let carShows: Array<CarShow>;
  let fixture: ComponentFixture<CarShowsPage>;
  let getAllPromise: Promise<Array<CarShow>>;

  beforeEach(async () => {
    carShows = deepCopy(testCarShowsOld);
    carShowsService = createCarShowsServiceMock();
    getAllPromise = Promise.resolve(carShows);
    carShowsService.getAll.and.returnValue(getAllPromise);
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

    it('assigns the returned shows', async () => {
      await getAllPromise;
      expect(component.allCarShows).toEqual(testCarShowsOld);
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

    it('assigns the returned shows', async () => {
      carShowsService.changed.next();
      await getAllPromise;
      expect(component.allCarShows).toEqual(testCarShowsOld);
    });
  });
});
