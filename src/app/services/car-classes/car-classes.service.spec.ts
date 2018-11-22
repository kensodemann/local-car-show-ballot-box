import { TestBed, inject } from '@angular/core/testing';

import { CarClassesService } from './car-classes.service';
import {
  createDatabaseServiceMock,
  DatabaseService,
  MockResultRows
} from '../database';
import { testCarClasses, testCarShowClasses } from './car-classes.test-data';
import { createSQLiteTransactionMock } from '../../../../test/mocks';

describe('CarClassesService', () => {
  let carClasses: CarClassesService;
  let database;

  beforeEach(() => {
    database = createDatabaseServiceMock();
    TestBed.configureTestingModule({
      providers: [
        CarClassesService,
        { provide: DatabaseService, useValue: database }
      ]
    });
  });

  beforeEach(inject([CarClassesService], (service: CarClassesService) => {
    carClasses = service;
  }));

  it('exists', () => {
    expect(carClasses).toBeTruthy();
  });

  describe('get all', () => {
    describe('without a car show ID parameter', () => {
      let classes: Array<any>;
      let transaction;
      let rows;

      beforeEach(() => {
        classes = testCarClasses.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description,
          active: c.active ? 1 : 0
        }));

        rows = new MockResultRows(classes);
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
        await carClasses.getAll();
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await carClasses.getAll();
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('queries the CarClasses table', async () => {
        await carClasses.getAll();
        expect(transaction.executeSql).toHaveBeenCalledTimes(1);
        expect(transaction.executeSql.calls.first().args[0]).toEqual(
          'SELECT * FROM CarClasses ORDER BY name'
        );
      });

      it('unpacks the data', async () => {
        const res = await carClasses.getAll();
        expect(res).toEqual(testCarClasses);
      });
    });

    describe('with car show ID parameter', () => {
      let classes: Array<any>;
      let transaction;
      let rows;

      beforeEach(() => {
        classes = testCarShowClasses
          .filter(c => c.carShowRid === 3)
          .map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            active: c.active ? 1 : 0,
            carShowRid: c.carShowRid
          }));

        rows = new MockResultRows(classes);
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
        await carClasses.getAll(3);
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await carClasses.getAll(3);
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('queries the CarShowClasses table', async () => {
        await carClasses.getAll(3);
        expect(transaction.executeSql).toHaveBeenCalledTimes(1);
        expect(transaction.executeSql.calls.first().args[0]).toEqual(
          'SELECT * FROM CarShowClasses WHERE carShowRid = ? ORDER BY name'
        );
        expect(transaction.executeSql.calls.first().args[1]).toEqual([3]);
      });

      it('unpacks the data', async () => {
        const res = await carClasses.getAll(3);
        expect(res).toEqual(testCarShowClasses.filter(c => c.carShowRid === 3));
      });
    });
  });
});
