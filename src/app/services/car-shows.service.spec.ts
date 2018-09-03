import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CarShow } from '../models/car-show';
import { CarShowsService } from './car-shows.service';
import { environment } from '../../environments/environment';

describe('CarShowsService', () => {
  let carShows: CarShowsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CarShowsService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
  });

  beforeEach(inject([CarShowsService], (service: CarShowsService) => {
    carShows = service;
  }));

  it('exists', () => {
    expect(carShows).toBeTruthy();
  });

  describe('get current', () => {
    let carShow: CarShow;
    beforeEach(() => {
      carShow = {
        id: 3,
        name: 'Waukesha Show 2017',
        date: '2017-08-10',
        year: 2017,
        classes: [
          {
            id: 9,
            name: 'A',
            description: 'Antique through 1954, Cars & Trucks',
            active: true
          },
          {
            id: 10,
            name: 'B',
            description: '1955-1962, Cars Only',
            active: true
          },
          {
            id: 11,
            name: 'C',
            description: '1963-1967, Cars Only',
            active: true
          },
          {
            id: 12,
            name: 'D',
            description: '1968-1970, Cars Only',
            active: true
          }
        ]
      };
    });

    it('gets the current car show', () => {
      carShows.getCurrent().subscribe(c => expect(c).toEqual(carShow));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-shows/current`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(carShow);
      httpTestingController.verify();
    });

    it('caches the current car show', () => {
      carShows.getCurrent().subscribe(c => expect(c).toEqual(carShow));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-shows/current`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(carShow);
      carShows.getCurrent().subscribe(c => expect(c).toEqual(carShow));
      httpTestingController.verify();
    });
  });
});
