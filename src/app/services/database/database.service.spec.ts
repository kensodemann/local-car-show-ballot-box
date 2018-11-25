import { inject, TestBed } from '@angular/core/testing';
import { SQLite } from '@ionic-native/sqlite/ngx';

import {
  createSQLiteMock,
  createSQLiteObjectMock,
  createSQLiteTransactionMock
} from '../../../../test/mocks';

import { carClasses } from './car-classes';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let database: DatabaseService;
  let dbHandle;
  let sqlite;
  let transaction;

  beforeEach(() => {
    sqlite = createSQLiteMock();
    dbHandle = createSQLiteObjectMock();
    sqlite.create.and.returnValue(Promise.resolve(dbHandle));
    transaction = createSQLiteTransactionMock();
    dbHandle.transaction.and.callFake(fn => {
      fn(transaction);
      return Promise.resolve();
    });
    TestBed.configureTestingModule({
      providers: [{ provide: SQLite, useValue: sqlite }]
    });
  });

  beforeEach(inject([DatabaseService], (service: DatabaseService) => {
    database = service;
  }));

  it('should be created', () => {
    expect(database).toBeTruthy();
  });

  describe('when ready', () => {
    it('has a handle for the database', async () => {
      await database.ready();
      expect(database.handle).toEqual(dbHandle);
    });

    it('has opened the database', async () => {
      await database.ready();
      expect(sqlite.create).toHaveBeenCalledTimes(1);
      expect(sqlite.create).toHaveBeenCalledWith({
        name: 'carshow.db',
        location: 'default'
      });
    });

    it('has created a transaction', async () => {
      await database.ready();
      expect(dbHandle.transaction).toHaveBeenCalledTimes(1);
    });

    it('has created the CarClasses table', async () => {
      await database.ready();
      expect(transaction.executeSql).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS CarClasses (id INTEGER PRIMARY KEY, name TEXT, description TEXT, active INTEGER)'
      );
    });

    it('has created the CarShows table', async () => {
      await database.ready();
      expect(transaction.executeSql).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS CarShows (id INTEGER PRIMARY KEY, name TEXT, date TEXT, year INTEGER)'
      );
    });

    it('has created the CarShowClasses table', async () => {
      await database.ready();
      expect(transaction.executeSql).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS CarShowClasses ' +
          '(id INTEGER PRIMARY KEY, name TEXT, description TEXT, active INTEGER, carShowRid INTEGER)'
      );
    });

    it('has created the CarShowBallots table', async () => {
      await database.ready();
      expect(transaction.executeSql).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS CarShowBallots (id INTEGER PRIMARY KEY, timestamp TEXT, carShowRid INTEGER)'
      );
    });

    it('has created the CarShowBallotVotes table', async () => {
      await database.ready();
      expect(transaction.executeSql).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS CarShowBallotVotes ' +
          '(id INTEGER PRIMARY KEY, carShowBallotRid INTEGER, carShowClassRid INTEGER, carNumber INTEGER)'
      );
    });

    it('has loaded the CarClasses table', async () => {
      await database.ready();
      expect(transaction.executeSql).toHaveBeenCalledWith(
        'DELETE FROM CarClasses'
      );
      carClasses.forEach(cls => {
        expect(transaction.executeSql).toHaveBeenCalledWith(
          'INSERT INTO CarClasses VALUES (?, ?, ?, ?)',
          [cls.id, cls.name, cls.description, cls.active ? 1 : 0]
        );
      });
    });
  });
});
