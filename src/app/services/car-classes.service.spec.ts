import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CarClass } from '../models/car-class';
import { CarClassesService } from './car-classes.service';
import { environment } from '../../environments/environment';

describe('CarClassesService', () => {
  let carClasses: CarClassesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CarClassesService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
  });

  beforeEach(inject([CarClassesService], (service: CarClassesService) => {
    carClasses = service;
  }));

  it('exists', () => {
    expect(carClasses).toBeTruthy();
  });

  describe('get all', () => {
    let classes: Array<CarClass>;
    beforeEach(() => {
      classes = [
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
      ];
    });

    it('gets all of the car classes', () => {
      carClasses.getAll().subscribe(c => expect(c).toEqual(classes));
      const req = httpTestingController.expectOne(`${environment.dataService}/car-classes`);
      expect(req.request.method).toEqual('GET');
      req.flush(classes);
      httpTestingController.verify();
    });
  });
});
