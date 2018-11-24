import { TestBed, inject } from '@angular/core/testing';

import { CarClassesService } from './car-classes.service';
import {
  createDatabaseServiceMock,
  DatabaseService,
  MockResultRows
} from '../database';
import { testCarClasses, testCarShowClasses } from './car-classes.test-data';
import { CarClass } from '../../models/car-class';
import { createSQLiteTransactionMock } from '../../../../test/mocks';

describe('CarClassesService', () => {
  let carClassesService: CarClassesService;
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
    carClassesService = service;
  }));

  it('exists', () => {
    expect(carClassesService).toBeTruthy();
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
        transaction.executeSql.and.callFake((_sql, _params, fn) => {
          fn(transaction, { rows });
        });
        database.handle.transaction.and.callFake(fn => {
          fn(transaction);
          return Promise.resolve();
        });
      });

      it('waits for the database to be ready', async () => {
        await carClassesService.getAll();
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await carClassesService.getAll();
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('queries the CarClasses table', async () => {
        await carClassesService.getAll();
        expect(transaction.executeSql).toHaveBeenCalledTimes(1);
        expect(transaction.executeSql.calls.first().args[0]).toEqual(
          'SELECT * FROM CarClasses ORDER BY name'
        );
      });

      it('unpacks the data', async () => {
        const res = await carClassesService.getAll();
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
        transaction.executeSql.and.callFake((_sql, _params, fn) => {
          fn(transaction, { rows });
        });
        database.handle.transaction.and.callFake(fn => {
          fn(transaction);
          return Promise.resolve();
        });
      });

      it('waits for the database to be ready', async () => {
        await carClassesService.getAll(3);
        expect(database.ready).toHaveBeenCalledTimes(1);
      });

      it('opens a transaction', async () => {
        await carClassesService.getAll(3);
        expect(database.handle.transaction).toHaveBeenCalledTimes(1);
      });

      it('queries the CarShowClasses table', async () => {
        await carClassesService.getAll(3);
        expect(transaction.executeSql).toHaveBeenCalledTimes(1);
        expect(transaction.executeSql.calls.first().args[0]).toEqual(
          'SELECT * FROM CarShowClasses WHERE carShowRid = ? ORDER BY name'
        );
        expect(transaction.executeSql.calls.first().args[1]).toEqual([3]);
      });

      it('unpacks the data', async () => {
        const res = await carClassesService.getAll(3);
        expect(res).toEqual(testCarShowClasses.filter(c => c.carShowRid === 3));
      });
    });
  });

  describe('save', () => {
    let testClass: CarClass;
    let transaction;
    describe('car class', () => {
      describe('without an ID', () => {
        beforeEach(() => {
          testClass = {
            name: 'Z',
            description: 'Zombie Cars',
            active: true
          };
          const rows = new MockResultRows([{ newId: 19 }]);
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
          await carClassesService.save(testClass);
          expect(database.ready).toHaveBeenCalledTimes(1);
        });

        it('opens a transaction', async () => {
          await carClassesService.save(testClass);
          expect(database.handle.transaction).toHaveBeenCalledTimes(1);
        });

        it('selects the maximum used car class id and inserts the car class', async () => {
          await carClassesService.save(testClass);
          expect(transaction.executeSql).toHaveBeenCalledTimes(2);
          expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
            'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarClasses'
          );
          expect(transaction.executeSql.calls.argsFor(1)[0]).toEqual(
            'INSERT INTO CarClasses (id, name, description, active) VALUES (?, ?, ?, ?)'
          );
          expect(transaction.executeSql.calls.argsFor(1)[1]).toEqual([
            19,
            testClass.name,
            testClass.description,
            1
          ]);
        });

        it('resolves the newly saved show', async () => {
          const show = await carClassesService.save(testClass);
          expect(show).toEqual({ id: 19, ...testClass });
        });
      });

      describe('with an ID', () => {
        beforeEach(() => {
          testClass = {
            id: 23,
            name: 'Z',
            description: 'Zombie Cars',
            active: true
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
          await carClassesService.save(testClass);
          expect(database.ready).toHaveBeenCalledTimes(1);
        });

        it('opens a transaction', async () => {
          await carClassesService.save(testClass);
          expect(database.handle.transaction).toHaveBeenCalledTimes(1);
        });

        it('updates the car show', async () => {
          await carClassesService.save(testClass);
          expect(transaction.executeSql).toHaveBeenCalledTimes(1);
          expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
            'UPDATE CarClasses SET name = ?, description = ?, active = ? WHERE id = ?'
          );
          expect(transaction.executeSql.calls.argsFor(0)[1]).toEqual([
            testClass.name,
            testClass.description,
            1,
            testClass.id
          ]);
        });

        it('resolves the car show', async () => {
          const show = await carClassesService.save(testClass);
          expect(show).toEqual(testClass);
        });
      });
    });

    describe('car show class', () => {
      describe('without an ID', () => {
        beforeEach(() => {
          testClass = {
            name: 'Z',
            description: 'Zombie Cars',
            active: true,
            carShowRid: 3
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
          await carClassesService.save(testClass);
          expect(database.ready).toHaveBeenCalledTimes(1);
        });

        it('opens a transaction', async () => {
          await carClassesService.save(testClass);
          expect(database.handle.transaction).toHaveBeenCalledTimes(1);
        });

        it('selects the maximum used car show class id and inserts the car show class', async () => {
          await carClassesService.save(testClass);
          expect(transaction.executeSql).toHaveBeenCalledTimes(2);
          expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
            'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShowClasses'
          );
          expect(transaction.executeSql.calls.argsFor(1)[0]).toEqual(
            'INSERT INTO CarShowClasses (id, name, description, active, carShowRid) VALUES (?, ?, ?, ?, ?)'
          );
          expect(transaction.executeSql.calls.argsFor(1)[1]).toEqual([
            73,
            testClass.name,
            testClass.description,
            1,
            testClass.carShowRid
          ]);
        });

        it('resolves the newly saved show', async () => {
          const show = await carClassesService.save(testClass);
          expect(show).toEqual({ id: 73, ...testClass });
        });
      });

      describe('with an ID', () => {
        beforeEach(() => {
          testClass = {
            id: 420,
            name: 'Z',
            description: 'Zombie Cars',
            active: true,
            carShowRid: 3
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
          await carClassesService.save(testClass);
          expect(database.ready).toHaveBeenCalledTimes(1);
        });

        it('opens a transaction', async () => {
          await carClassesService.save(testClass);
          expect(database.handle.transaction).toHaveBeenCalledTimes(1);
        });

        it('updates the car show', async () => {
          await carClassesService.save(testClass);
          expect(transaction.executeSql).toHaveBeenCalledTimes(1);
          expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
            'UPDATE CarShowClasses SET name = ?, description = ?, active = ?, carShowRid = ? WHERE id = ?'
          );
          expect(transaction.executeSql.calls.argsFor(0)[1]).toEqual([
            testClass.name,
            testClass.description,
            1,
            testClass.carShowRid,
            testClass.id
          ]);
        });

        it('resolves the car show', async () => {
          const show = await carClassesService.save(testClass);
          expect(show).toEqual(testClass);
        });
      });
    });
  });

  describe('save all', () => {
    describe('empty array', () => {
      it('throws and error', async () => {
        try {
          await carClassesService.saveAll([]);
          expect(true).toBe(false);
        } catch (error) {
          expect(error).toEqual(new Error('Cannot save empty array'));
        }
      });
    });

    describe('car classes', () => {
      describe('without an ID', () => {
        it('throws an error', async () => {
          try {
            await carClassesService.saveAll([
              { name: 'A', description: 'A class', active: true },
              { name: 'B', description: 'B class', active: true },
              { name: 'C', description: 'C class', active: true }
            ]);
            expect(true).toBe(false);
          } catch (error) {
            expect(error).toEqual(new Error('Can only save car show classes'));
          }
        });
      });

      describe('with an ID', () => {
        it('throws an error', async () => {
          try {
            await carClassesService.saveAll([
              { id: 42, name: 'A', description: 'A class', active: true },
              { id: 43, name: 'B', description: 'B class', active: true },
              { id: 44, name: 'C', description: 'C class', active: true }
            ]);
            expect(true).toBe(false);
          } catch (error) {
            expect(error).toEqual(new Error('Can only save car show classes'));
          }
        });
      });
    });

    describe('car show classes', () => {
      let transaction;
      describe('without an ID', () => {
        beforeEach(() => {
          const rows = new MockResultRows([{ newId: 420 }]);
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
          await carClassesService.saveAll([
            { name: 'A', description: 'A class', active: true, carShowRid: 3 },
            { name: 'B', description: 'B class', active: true, carShowRid: 3 },
            { name: 'C', description: 'C class', active: true, carShowRid: 3 }
          ]);
          expect(database.ready).toHaveBeenCalledTimes(1);
        });

        it('opens a transaction', async () => {
          await carClassesService.saveAll([
            { name: 'A', description: 'A class', active: true, carShowRid: 3 },
            { name: 'B', description: 'B class', active: true, carShowRid: 3 },
            { name: 'C', description: 'C class', active: true, carShowRid: 3 }
          ]);
          expect(database.handle.transaction).toHaveBeenCalledTimes(1);
        });

        it('determines the next ID to use and inserts the rows', async () => {
          const insertSql =
            'INSERT INTO CarShowClasses (id, name, description, active, carShowRid) VALUES (?, ?, ?, ?, ?)';
          await carClassesService.saveAll([
            { name: 'A', description: 'A class', active: true, carShowRid: 3 },
            { name: 'B', description: 'B class', active: true, carShowRid: 3 },
            { name: 'C', description: 'C class', active: true, carShowRid: 3 }
          ]);
          expect(transaction.executeSql).toHaveBeenCalledTimes(4);
          expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(
            'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShowClasses'
          );
          expect(transaction.executeSql.calls.argsFor(1)[0]).toEqual(insertSql);
          expect(transaction.executeSql.calls.argsFor(1)[1]).toEqual([
            420,
            'A',
            'A class',
            1,
            3
          ]);
          expect(transaction.executeSql.calls.argsFor(2)[0]).toEqual(insertSql);
          expect(transaction.executeSql.calls.argsFor(2)[1]).toEqual([
            421,
            'B',
            'B class',
            1,
            3
          ]);
          expect(transaction.executeSql.calls.argsFor(3)[0]).toEqual(insertSql);
          expect(transaction.executeSql.calls.argsFor(3)[1]).toEqual([
            422,
            'C',
            'C class',
            1,
            3
          ]);
        });

        it('resolves the updated array of classes', async () => {
          const ret = await carClassesService.saveAll([
            { name: 'A', description: 'A class', active: true, carShowRid: 3 },
            { name: 'B', description: 'B class', active: true, carShowRid: 3 },
            { name: 'C', description: 'C class', active: true, carShowRid: 3 }
          ]);
          expect(ret).toEqual([
            {
              id: 420,
              name: 'A',
              description: 'A class',
              active: true,
              carShowRid: 3
            },
            {
              id: 421,
              name: 'B',
              description: 'B class',
              active: true,
              carShowRid: 3
            },
            {
              id: 422,
              name: 'C',
              description: 'C class',
              active: true,
              carShowRid: 3
            }
          ]);
        });
      });

      describe('with an ID', () => {
        beforeEach(() => {
          const rows = new MockResultRows([{ newId: 420 }]);
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
          await carClassesService.saveAll([
            {
              id: 320,
              name: 'A',
              description: 'A class',
              active: true,
              carShowRid: 3
            },
            {
              id: 321,
              name: 'B',
              description: 'B class',
              active: true,
              carShowRid: 3
            },
            {
              id: 322,
              name: 'C',
              description: 'C class',
              active: true,
              carShowRid: 3
            }
          ]);
          expect(database.ready).toHaveBeenCalledTimes(1);
        });

        it('opens a transaction', async () => {
          await carClassesService.saveAll([
            {
              id: 320,
              name: 'A',
              description: 'A class',
              active: true,
              carShowRid: 3
            },
            {
              id: 321,
              name: 'B',
              description: 'B class',
              active: true,
              carShowRid: 3
            },
            {
              id: 322,
              name: 'C',
              description: 'C class',
              active: true,
              carShowRid: 3
            }
          ]);
          expect(database.handle.transaction).toHaveBeenCalledTimes(1);
        });

        it('updates the rows', async () => {
          const updateSql =
            'UPDATE CarShowClasses SET name = ?, description = ?, active = ?, carShowRid = ? WHERE id = ?';
          await carClassesService.saveAll([
            {
              id: 320,
              name: 'A',
              description: 'A class',
              active: true,
              carShowRid: 3
            },
            {
              id: 322,
              name: 'B',
              description: 'B class',
              active: true,
              carShowRid: 3
            },
            {
              id: 323,
              name: 'C',
              description: 'C class',
              active: true,
              carShowRid: 3
            }
          ]);
          expect(transaction.executeSql).toHaveBeenCalledTimes(3);
          expect(transaction.executeSql.calls.argsFor(0)[0]).toEqual(updateSql);
          expect(transaction.executeSql.calls.argsFor(0)[1]).toEqual([
            'A',
            'A class',
            1,
            3,
            320
          ]);
          expect(transaction.executeSql.calls.argsFor(1)[0]).toEqual(updateSql);
          expect(transaction.executeSql.calls.argsFor(1)[1]).toEqual([
            'B',
            'B class',
            1,
            3,
            322
          ]);
          expect(transaction.executeSql.calls.argsFor(2)[0]).toEqual(updateSql);
          expect(transaction.executeSql.calls.argsFor(2)[1]).toEqual([
            'C',
            'C class',
            1,
            3,
            323
          ]);
        });

        it('resolves the array of classes', async () => {
          const ret = await carClassesService.saveAll([
            {
              id: 220,
              name: 'A',
              description: 'A class',
              active: true,
              carShowRid: 3
            },
            {
              id: 221,
              name: 'B',
              description: 'B class',
              active: true,
              carShowRid: 3
            },
            {
              id: 222,
              name: 'C',
              description: 'C class',
              active: true,
              carShowRid: 3
            }
          ]);
          expect(ret).toEqual([
            {
              id: 220,
              name: 'A',
              description: 'A class',
              active: true,
              carShowRid: 3
            },
            {
              id: 221,
              name: 'B',
              description: 'B class',
              active: true,
              carShowRid: 3
            },
            {
              id: 222,
              name: 'C',
              description: 'C class',
              active: true,
              carShowRid: 3
            }
          ]);
        });
      });
    });
  });
});
