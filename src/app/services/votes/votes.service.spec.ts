import { inject, TestBed } from '@angular/core/testing';

import {
  createDatabaseServiceMock,
  DatabaseService,
  MockResultRows
} from '../database';
import { createSQLiteTransactionMock } from '../../../../test/mocks';
import { deepCopy } from '../../../../test/util';
import { testVotes } from './votes.data';
import { Vote } from '../../models/vote';
import { VotesService } from './votes.service';

describe('VotesService', () => {
  let database;
  let votesService: VotesService;

  beforeEach(() => {
    database = createDatabaseServiceMock();
    TestBed.configureTestingModule({
      providers: [{ provide: DatabaseService, useValue: database }]
    });
  });

  beforeEach(inject([VotesService], (service: VotesService) => {
    votesService = service;
  }));

  it('exists', () => {
    expect(votesService).toBeTruthy();
  });

  describe('get all', () => {
    let votes: Array<Vote>;
    let transaction;
    let rows;

    beforeEach(() => {
      votes = deepCopy(
        testVotes.filter(
          v => v.carShowBallotRid >= 29 && v.carShowBallotRid <= 45
        )
      );
      rows = new MockResultRows(votes);
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
      await votesService.getAll(3);
      expect(database.ready).toHaveBeenCalledTimes(1);
    });

    it('opens a transaction', async () => {
      await votesService.getAll(3);
      expect(database.handle.transaction).toHaveBeenCalledTimes(1);
    });

    it('queries the CarShowBallotVotes table for votes for the car show', async () => {
      await votesService.getAll(3);
      expect(transaction.executeSql).toHaveBeenCalledTimes(1);
      expect(transaction.executeSql.calls.first().args[0]).toEqual(
        'SELECT CarShowBallotVotes.* FROM CarShowBallotVotes' +
          ' JOIN CarShowBallots ON CarShowBallots.id = CarShowBallotVotes.carShowBallotRid ' +
          'WHERE CarShowBallots.carShowRid = ?'
      );
      expect(transaction.executeSql.calls.first().args[1]).toEqual([3]);
    });

    it('unpacks the data', async () => {
      const res = await votesService.getAll(3);
      expect(res).toEqual(votes);
    });
  });

  describe('get ballot votes', () => {
    let votes: Array<Vote>;
    let transaction;
    let rows;

    beforeEach(() => {
      votes = deepCopy(testVotes.filter(v => v.carShowBallotRid === 29));
      rows = new MockResultRows(votes);
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
      await votesService.getBallotVotes(29);
      expect(database.ready).toHaveBeenCalledTimes(1);
    });

    it('opens a transaction', async () => {
      await votesService.getBallotVotes(29);
      expect(database.handle.transaction).toHaveBeenCalledTimes(1);
    });

    it('queries the CarShowBallotVotes table for votes for the car show', async () => {
      await votesService.getBallotVotes(29);
      expect(transaction.executeSql).toHaveBeenCalledTimes(1);
      expect(transaction.executeSql.calls.first().args[0]).toEqual(
        'SELECT * FROM CarShowBallotVotes WHERE carShowBallotRid = ?'
      );
      expect(transaction.executeSql.calls.first().args[1]).toEqual([29]);
    });

    it('unpacks the data', async () => {
      const res = await votesService.getBallotVotes(29);
      expect(res).toEqual(votes);
    });
  });

  describe('save', () => {
    let testVote: Vote;

    describe('with an ID', () => {
      let transaction;
      beforeEach(() => {
        testVote = {
          id: 7,
          carShowBallotRid: 4,
          carShowClassRid: 9,
          carNumber: 42
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
        await votesService.save(testVote);
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await votesService.save(testVote);
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('updates the vote', async () => {
        await votesService.save(testVote);
        expect(transaction.executeSql).toHaveBeenCalledTimes(1);
        expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
          'UPDATE CarShowBallotVotes SET carShowBallotRid = ?, carShowClassRid = ?, carNumber = ? WHERE id = ?'
        );
        expect(transaction.executeSql.calls.argsFor(0)[1]).toEqual([
          testVote.carShowBallotRid,
          testVote.carShowClassRid,
          testVote.carNumber,
          testVote.id
        ]);
      });

      it('resolves the ballot as updated', async () => {
        const show = await votesService.save(testVote);
        expect(show).toEqual(testVote);
      });
    });

    describe('without an ID', () => {
      let transaction;
      beforeEach(() => {
        testVote = {
          carShowBallotRid: 4,
          carShowClassRid: 9,
          carNumber: 42
        };
        const rows = new MockResultRows([{ newId: 73 }]);
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
        await votesService.save(testVote);
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await votesService.save(testVote);
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('selects the maximum used ballot id and inserts the ballot', async () => {
        await votesService.save(testVote);
        expect(transaction.executeSql).toHaveBeenCalledTimes(2);
        expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
          'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShowBallotVotes'
        );
        expect(transaction.executeSql.calls.argsFor(1)[0]).toEqual(
          'INSERT INTO CarShowBallotVotes (id, carShowBallotRid, carShowClassRid, carNumber) VALUES (?, ?, ?, ?)'
        );
        expect(transaction.executeSql.calls.argsFor(1)[1]).toEqual([
          73,
          testVote.carShowBallotRid,
          testVote.carShowClassRid,
          testVote.carNumber
        ]);
      });

      it('resolves the newly saved ballot', async () => {
        const show = await votesService.save(testVote);
        expect(show).toEqual({ id: 73, ...testVote });
      });
    });

    describe('without a carNumber', () => {
      describe('without an ID', () => {
        beforeEach(() => {
          testVote = {
            carShowBallotRid: 42,
            carShowClassRid: 18
          };
        });

        it('does nothing', async () => {
          await votesService.save(testVote);
          expect(database.ready).toHaveBeenCalledTimes(1);
          expect(database.handle.transaction).not.toHaveBeenCalled();
        });

        it('resolves null', async () => {
          expect(await votesService.save(testVote)).toEqual(null);
        });
      });

      describe('with an ID', () => {
        let transaction;
        beforeEach(() => {
          testVote = {
            id: 77,
            carShowBallotRid: 42,
            carShowClassRid: 18
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
          await votesService.save(testVote);
          expect(database.ready).toHaveBeenCalledTimes(1);
        });

        it('opens a trainsaction', async () => {
          await votesService.save(testVote);
          expect(database.handle.transaction).toHaveBeenCalledTimes(1);
        });

        it('deletes the row', async () => {
          await votesService.save(testVote);
          expect(transaction.executeSql).toHaveBeenCalledTimes(1);
          expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
            'DELETE FROM CarShowBallotVotes WHERE id = ?'
          );
          expect(transaction.executeSql.calls.argsFor(0)[1]).toEqual([
            testVote.id
          ]);
        });

        it('resolves null', async () => {
          expect(await votesService.save(testVote)).toEqual(null);
        });
      });
    });
  });
});
