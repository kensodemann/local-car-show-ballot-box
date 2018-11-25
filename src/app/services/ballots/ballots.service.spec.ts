import { inject, TestBed } from '@angular/core/testing';

import { Ballot } from '../../models/ballot';
import { BallotsService } from './ballots.service';
import {
  createDatabaseServiceMock,
  DatabaseService,
  MockResultRows
} from '../database';
import { createSQLiteTransactionMock } from '../../../../test/mocks';
import { deepCopy } from '../../../../test/util';
import { testBallots } from './ballots.test-data';

describe('BallotsService', () => {
  let ballotsService: BallotsService;
  let database;

  beforeEach(() => {
    database = createDatabaseServiceMock();
    TestBed.configureTestingModule({
      providers: [{ provide: DatabaseService, useValue: database }]
    });
  });

  beforeEach(inject([BallotsService], (service: BallotsService) => {
    ballotsService = service;
  }));

  it('exists', () => {
    expect(ballotsService).toBeTruthy();
  });

  describe('get all', () => {
    let ballots: Array<Ballot>;
    let transaction;
    let rows;

    beforeEach(() => {
      ballots = deepCopy(testBallots.filter(b => b.carShowRid === 3));
      rows = new MockResultRows(ballots);
      transaction = createSQLiteTransactionMock();
      transaction.executeSql.and.callFake((_sql, _params, fn) => {
        fn(transaction, { rows });
      });
      database.handle.transaction.and.callFake(fn => {
        fn(transaction);
        return Promise.resolve();
      });
    });

    it('waits for the database to be ready', async () => {
      await ballotsService.getAll(3);
      expect(database.ready).toHaveBeenCalledTimes(1);
    });

    it('opens a transaction', async () => {
      await ballotsService.getAll(3);
      expect(database.handle.transaction).toHaveBeenCalledTimes(1);
    });

    it('queries the CarShowBallots table', async () => {
      await ballotsService.getAll(3);
      expect(transaction.executeSql).toHaveBeenCalledTimes(1);
      expect(transaction.executeSql.calls.first().args[0]).toEqual(
        'SELECT * FROM CarShowBallots WHERE carShowRid = ? ORDER BY timestamp'
      );
      expect(transaction.executeSql.calls.first().args[1]).toEqual([3]);
    });

    it('unpacks the data', async () => {
      const res = await ballotsService.getAll(3);
      expect(res).toEqual(ballots);
    });
  });

  describe('save', () => {
    let testBallot: Ballot;

    beforeEach(() => {
      jasmine.clock().mockDate(new Date('2018-08-15T21:14:29.987Z'));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    describe('with an ID', () => {
      let transaction;
      beforeEach(() => {
        testBallot = {
          id: 7,
          timestamp: '2019-07-07T20:15:43.335Z',
          carShowRid: 1
        };
        transaction = createSQLiteTransactionMock();
        transaction.executeSql.and.callFake((_sql, _params, fn) => {
          fn(transaction, { rows: [] });
        });
        database.handle.transaction.and.callFake(fn => {
          fn(transaction);
          return Promise.resolve();
        });
      });

      it('waits for the database to be ready', async () => {
        await ballotsService.save(testBallot);
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await ballotsService.save(testBallot);
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('updates the ballot', async () => {
        await ballotsService.save(testBallot);
        expect(transaction.executeSql).toHaveBeenCalledTimes(1);
        expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
          'UPDATE CarShowBallots SET carShowRid = ? WHERE id = ?'
        );
        expect(transaction.executeSql.calls.argsFor(0)[1]).toEqual([
          testBallot.carShowRid,
          testBallot.id
        ]);
      });

      it('resolves the ballot as updated', async () => {
        const show = await ballotsService.save(testBallot);
        expect(show).toEqual(testBallot);
      });
    });

    describe('without an ID', () => {
      let transaction;
      beforeEach(() => {
        testBallot = {
          timestamp: '2019-07-07T20:15:43.335Z',
          carShowRid: 1
        };
        const rows = new MockResultRows([{ newId: 4 }]);
        transaction = createSQLiteTransactionMock();
        transaction.executeSql.and.callFake((sql, _params, fn) => {
          const select = /SELECT/.test(sql);
          fn(transaction, { rows: select ? rows : [] });
        });
        database.handle.transaction.and.callFake(fn => {
          fn(transaction);
          return Promise.resolve();
        });
      });

      it('waits for the database to be ready', async () => {
        await ballotsService.save(testBallot);
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await ballotsService.save(testBallot);
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('selects the maximum used ballot id and inserts the ballot', async () => {
        await ballotsService.save(testBallot);
        expect(transaction.executeSql).toHaveBeenCalledTimes(2);
        expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
          'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShowBallots'
        );
        expect(transaction.executeSql.calls.argsFor(1)[0]).toEqual(
          'INSERT INTO CarShowBallots (id, timestamp, carShowRid) VALUES (?, ?, ?)'
        );
        expect(transaction.executeSql.calls.argsFor(1)[1]).toEqual([
          4,
          '2018-08-15T21:14:29.987Z',
          testBallot.carShowRid
        ]);
      });

      it('resolves the newly saved ballot', async () => {
        const show = await ballotsService.save(testBallot);
        expect(show).toEqual({
          id: 4,
          timestamp: '2018-08-15T21:14:29.987Z',
          carShowRid: testBallot.carShowRid
        });
      });
    });
  });
});
