import { inject, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CarClass } from '../../models/car-class';
import { CarShow } from '../../models/car-show';
import { CarShowsService } from './car-shows.service';
import { deepCopy } from '../../../../test/util';
import { environment } from '../../../environments/environment';
import { testCarClasses } from '../car-classes/car-classes.test-data';
import { testCarShows } from './car-shows.test-data';

describe('CarShowsService', () => {
  let carShowsService: CarShowsService;
  let carShows: Array<CarShow>;
  let carShow: CarShow;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CarShowsService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
  });

  beforeEach(inject([CarShowsService], (service: CarShowsService) => {
    carShowsService = service;
  }));

  beforeEach(() => {
    carShows = deepCopy(testCarShows);
    carShow = deepCopy(testCarShows.find(c => c.id === 3));
  });

  it('exists', () => {
    expect(carShowsService).toBeTruthy();
  });

  it('starts with the current car show undefined', () => {
    expect(carShowsService.current).toBeUndefined();
  });

  describe('get all', () => {
    it('gets all of the car shows', () => {
      carShowsService.getAll().subscribe(c => expect(c).toEqual(carShows));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-shows`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(carShows);
      httpTestingController.verify();
    });
  });

  describe('get current', () => {
    it('gets the current car show', () => {
      carShowsService.getCurrent().subscribe(c => expect(c).toEqual(carShow));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-shows/current`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(carShow);
      httpTestingController.verify();
    });

    it('sets the current car show', () => {
      carShowsService.getCurrent().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-shows/current`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(carShow);
      expect(carShowsService.current).toEqual(carShow);
    });

    it('sets the current undefined if there is no car show', () => {
      carShowsService.current = deepCopy(carShow);
      carShowsService.getCurrent().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-shows/current`
      );
      expect(req.request.method).toEqual('GET');
      req.flush({});
      expect(carShowsService.current).toBeUndefined();
    });
  });

  describe('create car show', () => {
    let classes: Array<CarClass>;
    beforeEach(() => {
      jasmine.clock().mockDate(new Date(2017, 7, 18));
      classes = deepCopy(testCarClasses);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('sets the date based on the current date', done => {
      carShowsService.createCarShow().subscribe(show => {
        expect(show.date).toEqual('2017-08-18');
        done();
      });
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      req.flush(classes);
    });

    it('sets the year based on the current year', done => {
      carShowsService.createCarShow().subscribe(show => {
        expect(show.year).toEqual(2017);
        done();
      });
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      req.flush(classes);
    });

    it('sets the name to a default name', done => {
      carShowsService.createCarShow().subscribe(show => {
        expect(show.name).toEqual('Annual Car Show - 2017');
        done();
      });
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      req.flush(classes);
    });

    it('queries the classes', () => {
      carShowsService.createCarShow().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });

    it('sets the classes without ids', done => {
      carShowsService.createCarShow().subscribe(show => {
        expect(show.classes).toEqual(
          classes.map(c => {
            const cls = { ...c };
            delete cls.id;
            return cls;
          })
        );
        done();
      });
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      req.flush(classes);
    });

    it('ignores the inactive classes', done => {
      classes[1].active = false;
      classes[5].active = false;
      carShowsService.createCarShow().subscribe(show => {
        expect(show.classes).toEqual(
          classes.filter(c => c.active).map(c => {
            const cls = { ...c };
            delete cls.id;
            return cls;
          })
        );
        done();
      });
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      req.flush(classes);
    });
  });

  describe('save', () => {
    describe('with an ID', () => {
      it('POSTs the car show', () => {
        carShowsService
          .save(carShow)
          .subscribe(c => expect(c).toEqual(carShow));
        const req = httpTestingController.expectOne(
          `${environment.dataService}/car-shows/${carShow.id}`
        );
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(carShow);
        req.flush(carShow);
        httpTestingController.verify();
      });

      it('triggers the changed subject', () => {
        let fired = false;
        carShowsService.changed.subscribe(() => (fired = true));
        carShowsService.save(carShow).subscribe();
        const req = httpTestingController.expectOne(
          `${environment.dataService}/car-shows/${carShow.id}`
        );
        req.flush(carShow);
        expect(fired).toEqual(true);
      });
    });

    describe('without an ID', () => {
      beforeEach(() => {
        delete carShow.id;
      });

      it('POSTs the car show', () => {
        carShowsService
          .save(carShow)
          .subscribe(c => expect(c).toEqual({ id: 42, ...carShow }));
        const req = httpTestingController.expectOne(
          `${environment.dataService}/car-shows`
        );
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(carShow);
        req.flush({ id: 42, ...carShow });
        httpTestingController.verify();
      });

      it('triggers the changed subject', () => {
        let fired = false;
        carShowsService.changed.subscribe(() => (fired = true));
        carShowsService.save(carShow).subscribe();
        const req = httpTestingController.expectOne(
          `${environment.dataService}/car-shows`
        );
        req.flush({ id: 42, ...carShow });
        expect(fired).toEqual(true);
      });
    });
  });
});
