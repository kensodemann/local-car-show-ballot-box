import { inject, TestBed } from '@angular/core/testing';

import { CarShow } from '../../models/car-show';
import { CarShowsService } from './car-shows.service';
import { testCarShows } from './car-shows.test-data';
import {
  createDatabaseServiceMock,
  DatabaseService,
  MockResultRows
} from '../database';
import { createSQLiteTransactionMock } from '../../../../test/mocks';

describe('CarShowsService', () => {
  let carShowsService: CarShowsService;
  let database;

  beforeEach(() => {
    database = createDatabaseServiceMock();
    TestBed.configureTestingModule({
      providers: [
        CarShowsService,
        { provide: DatabaseService, useValue: database }
      ]
    });
  });

  beforeEach(inject([CarShowsService], (service: CarShowsService) => {
    carShowsService = service;
  }));

  it('exists', () => {
    expect(carShowsService).toBeTruthy();
  });

  it('starts with the current car show undefined', () => {
    expect(carShowsService.current).toBeUndefined();
  });

  describe('get all', () => {
    let transaction;
    let rows;

    beforeEach(() => {
      const carShows = testCarShows.map(s => ({
        id: s.id,
        name: s.name,
        date: s.date,
        year: s.year
      }));

      rows = new MockResultRows(carShows);
      transaction = createSQLiteTransactionMock();
      transaction.executeSql.and.callFake((sql, params, fn) => {
        fn(transaction, { rows });
      });
      database.handle.transaction.and.callFake(fn => {
        fn(transaction);
        return Promise.resolve();
      });
    });

    it('waits for the database to be ready', async () => {
      await carShowsService.getAll();
      expect(database.ready).toHaveBeenCalledTimes(1);
    });

    it('opens a transaction', async () => {
      await carShowsService.getAll();
      expect(database.handle.transaction).toHaveBeenCalledTimes(1);
    });

    it('queries the CarClasses table', async () => {
      await carShowsService.getAll();
      expect(transaction.executeSql).toHaveBeenCalledTimes(1);
      expect(transaction.executeSql.calls.first().args[0]).toEqual(
        'SELECT * FROM CarShows ORDER BY year'
      );
    });

    it('unpacks the data', async () => {
      const res = await carShowsService.getAll();
      expect(res).toEqual(testCarShows);
    });
  });

  describe('get current', () => {
    let rows;
    let transaction;

    beforeEach(() => {
      jasmine.clock().mockDate(new Date(2016, 8, 23));
      const carShow = {
        id: testCarShows[2].id,
        name: testCarShows[2].name,
        date: testCarShows[2].date,
        year: testCarShows[2].year
      };

      rows = new MockResultRows([carShow]);
      transaction = createSQLiteTransactionMock();
      transaction.executeSql.and.callFake((sql, params, fn) => {
        fn(transaction, { rows });
      });
      database.handle.transaction.and.callFake(fn => {
        fn(transaction);
        return Promise.resolve();
      });
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('waits for the database to be ready', async () => {
      await carShowsService.getCurrent();
      expect(database.ready).toHaveBeenCalledTimes(1);
    });

    it('opens a transaction', async () => {
      await carShowsService.getCurrent();
      expect(database.handle.transaction).toHaveBeenCalledTimes(1);
    });

    it('queries the CarShows table', async () => {
      await carShowsService.getCurrent();
      expect(transaction.executeSql).toHaveBeenCalledTimes(1);
      expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
        'SELECT * FROM CarShows WHERE year = ?'
      );
    });

    it('queries based on the current year', async () => {
      await carShowsService.getCurrent();
      expect(transaction.executeSql.calls.argsFor(0)[1]).toEqual([2016]);
    });

    it('resolves the full car show data', async () => {
      const show = await carShowsService.getCurrent();
      expect(show).toEqual({
        id: testCarShows[2].id,
        name: testCarShows[2].name,
        date: testCarShows[2].date,
        year: testCarShows[2].year
      });
    });

    it('sets current to the car show', async () => {
      await carShowsService.getCurrent();
      expect(carShowsService.current).toEqual({
        id: testCarShows[2].id,
        name: testCarShows[2].name,
        date: testCarShows[2].date,
        year: testCarShows[2].year
      });
    });
  });

  describe('save', () => {
    let testShow: CarShow;
    describe('with an ID', () => {
      let transaction;
      beforeEach(() => {
        testShow = {
          id: 7,
          name: 'Luckyj number 7 show',
          date: '2019-07-07',
          year: 2019
        };
        transaction = createSQLiteTransactionMock();
        transaction.executeSql.and.callFake((sql, params, fn) => {
          fn(transaction, { rows: [] });
        });
        database.handle.transaction.and.callFake(fn => {
          fn(transaction);
          return Promise.resolve();
        });
      });

      it('waits for the database to be ready', async () => {
        await carShowsService.save(testShow);
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await carShowsService.save(testShow);
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('updates the car show', async () => {
        await carShowsService.save(testShow);
        expect(transaction.executeSql).toHaveBeenCalledTimes(1);
        expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
          'UPDATE CarShows SET name = ?, date = ?, year = ? WHERE id = ?'
        );
        expect(transaction.executeSql.calls.argsFor(0)[1]).toEqual([
          testShow.name,
          testShow.date,
          testShow.year,
          testShow.id
        ]);
      });

      it('resolves the car show', async () => {
        const show = await carShowsService.save(testShow);
        expect(show).toEqual(testShow);
      });

      it('triggers the changed subject', async () => {
        let changed = false;
        carShowsService.changed.subscribe(() => (changed = true));
        await carShowsService.save(testShow);
        expect(changed).toEqual(true);
      });
    });

    describe('without an ID', () => {
      let transaction;
      beforeEach(() => {
        testShow = {
          name: 'Some new show',
          date: '2019-07-07',
          year: 2019
        };
        const rows = new MockResultRows([{ newId: 4 }]);
        transaction = createSQLiteTransactionMock();
        transaction.executeSql.and.callFake((sql, params, fn) => {
          const select = /SELECT/.test(sql);
          fn(transaction, { rows: select ? rows : [] });
        });
        database.handle.transaction.and.callFake(fn => {
          fn(transaction);
          return Promise.resolve();
        });
      });

      it('waits for the database to be ready', async () => {
        await carShowsService.save(testShow);
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await carShowsService.save(testShow);
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('selects the maximum used car show id and inserts the car show', async () => {
        await carShowsService.save(testShow);
        expect(transaction.executeSql).toHaveBeenCalledTimes(2);
        expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
          'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShows'
        );
        expect(transaction.executeSql.calls.argsFor(1)[0]).toEqual(
          'INSERT INTO CarShows (id, name, date, year) VALUES (?, ?, ?, ?)'
        );
        expect(transaction.executeSql.calls.argsFor(1)[1]).toEqual([
          4,
          testShow.name,
          testShow.date,
          testShow.year
        ]);
      });

      it('resolves the newly saved show', async () => {
        const show = await carShowsService.save(testShow);
        expect(show).toEqual({ id: 4, ...testShow });
      });

      it('triggers the changed subject', async () => {
        let changed = false;
        carShowsService.changed.subscribe(() => (changed = true));
        await carShowsService.save(testShow);
        expect(changed).toEqual(true);
      });
    });
  });
});
