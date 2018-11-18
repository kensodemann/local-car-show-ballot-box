import { TestBed, inject } from '@angular/core/testing';

import { CarClassesService } from './car-classes.service';
import {
  createDatabaseServiceMock,
  DatabaseService,
  MockResultRows
} from '../database';
import { testCarClasses } from './car-classes.test-data';
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
});
