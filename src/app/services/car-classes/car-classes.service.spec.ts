import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';


import { CarClass } from '../../models/car-class';
import { CarClassesService } from './car-classes.service';
import { deepCopy } from '../../../../test/util';
import { testCarClasses } from './car-classes.test-data';

describe('CarClassesService', () => {
  let carClasses: CarClassesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ CarClassesService ]
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
      classes = deepCopy(testCarClasses);
    });

    it('gets all of the car classes', () => {
      carClasses.getAll().subscribe(c => expect(c).toEqual(testCarClasses));
      const req = httpTestingController.expectOne('assets/data/car-classes.json');
      expect(req.request.method).toEqual('GET');
      req.flush(classes);
      httpTestingController.verify();
    });
  });
});
