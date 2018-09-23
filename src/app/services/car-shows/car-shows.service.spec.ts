import { inject, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CarClass } from '../../models/car-class';
import { CarShow } from '../../models/car-show';
import { CarShowsService } from './car-shows.service';
import { environment } from '../../../environments/environment';

describe('CarShowsService', () => {
  let carShows: CarShowsService;
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
    carShows = service;
  }));

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

  it('exists', () => {
    expect(carShows).toBeTruthy();
  });

  it('starts with the current car show undefined', () => {
    expect(carShows.current).toBeUndefined();
  });

  describe('get current', () => {
    it('gets the current car show', () => {
      carShows.getCurrent().subscribe(c => expect(c).toEqual(carShow));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-shows/current`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(carShow);
      httpTestingController.verify();
    });

    it('sets the current car show', () => {
      carShows.getCurrent().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-shows/current`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(carShow);
      expect(carShows.current).toEqual(carShow);
    });

    it('sets the current undefined if there is no car show', () => {
      carShows.current = { ...carShow };
      carShows.getCurrent().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-shows/current`
      );
      expect(req.request.method).toEqual('GET');
      req.flush({});
      expect(carShows.current).toBeUndefined();
    });
  });

  describe('create car show', () => {
    let classes: Array<CarClass>;
    beforeEach(() => {
      jasmine.clock().mockDate(new Date(2017, 7, 18));
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

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('sets the date based on the current date', done => {
      carShows.createCarShow().subscribe(show => {
        expect(show.date).toEqual('2017-08-18');
        done();
      });
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      req.flush(classes);
    });

    it('sets the year based on the current year', done => {
      carShows.createCarShow().subscribe(show => {
        expect(show.year).toEqual(2017);
        done();
      });
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      req.flush(classes);
    });

    it('sets the name to a default name', done => {
      carShows.createCarShow().subscribe(show => {
        expect(show.name).toEqual('Annual Car Show - 2017');
        done();
      });
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      req.flush(classes);
    });

    it('queries the classes', () => {
      carShows.createCarShow().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });

    it('sets the classes without ids', done => {
      carShows.createCarShow().subscribe(show => {
        expect(show.classes).toEqual([
          {
            name: 'A',
            description: 'Antique through 1954, Cars & Trucks',
            active: true
          },
          {
            name: 'B',
            description: '1955-1962, Cars Only',
            active: true
          },
          {
            name: 'C',
            description: '1963-1967, Cars Only',
            active: true
          },
          {
            name: 'D',
            description: '1968-1970, Cars Only',
            active: true
          }
        ]);
        done();
      });
      const req = httpTestingController.expectOne(
        `${environment.dataService}/car-classes`
      );
      req.flush(classes);
    });

    it('ignores the inactive classes', done => {
      classes[1].active = false;
      classes[2].active = false;
      carShows.createCarShow().subscribe(show => {
        expect(show.classes).toEqual([
          {
            name: 'A',
            description: 'Antique through 1954, Cars & Trucks',
            active: true
          },
          {
            name: 'D',
            description: '1968-1970, Cars Only',
            active: true
          }
        ]);
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
        carShows.save(carShow).subscribe(c => expect(c).toEqual(carShow));
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
        carShows.changed.subscribe(() => (fired = true));
        carShows.save(carShow).subscribe();
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
        carShows
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
        carShows.changed.subscribe(() => (fired = true));
        carShows.save(carShow).subscribe();
        const req = httpTestingController.expectOne(
          `${environment.dataService}/car-shows`
        );
        req.flush({ id: 42, ...carShow });
        expect(fired).toEqual(true);
      });
    });
  });
});
