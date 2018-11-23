import { Injectable } from '@angular/core';

import { CarClass } from '../../models/car-class';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class CarClassesService {
  constructor(private database: DatabaseService) {}

  async getAll(carShowId?: number): Promise<Array<CarClass>> {
    await this.database.ready();
    return carShowId ? this.getCarShowClasses(carShowId) : this.getCarClasses();
  }

  async save(carClass: CarClass): Promise<CarClass> {
    await this.database.ready();
    return carClass.carShowRid
      ? this.saveCarShowClass(carClass)
      : this.saveCarClass(carClass);
  }

  async saveAll(carClasses: Array<CarClass>): Promise<Array<CarClass>> {
    if (!carClasses.length) {
      throw new Error('Cannot save empty array');
    }
    if (!carClasses[0].carShowRid) {
      throw new Error('Can only save car show classes');
    }
    await this.database.ready();
    return this.saveAllCarShowClasses(carClasses);
  }

  private async getCarClasses(): Promise<Array<CarClass>> {
    const carClasses: Array<CarClass> = [];
    await this.database.handle.transaction(tx => {
      tx.executeSql('SELECT * FROM CarClasses ORDER BY name', [], (t, r) => {
        for (let idx = 0; idx < r.rows.length; idx++) {
          const c = r.rows.item(idx);
          carClasses.push({
            id: c.id,
            name: c.name,
            description: c.description,
            active: c.active === 1
          });
        }
      });
    });
    return carClasses;
  }

  private async getCarShowClasses(carShowId: number): Promise<Array<CarClass>> {
    const carClasses: Array<CarClass> = [];
    await this.database.handle.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM CarShowClasses WHERE carShowRid = ? ORDER BY name',
        [carShowId],
        (t, r) => {
          for (let idx = 0; idx < r.rows.length; idx++) {
            const c = r.rows.item(idx);
            carClasses.push({
              id: c.id,
              name: c.name,
              description: c.description,
              active: c.active === 1,
              carShowRid: c.carShowRid
            });
          }
        }
      );
    });
    return carClasses;
  }

  private async saveCarClass(carClass: CarClass): Promise<CarClass> {
    return carClass.id
      ? this.updateCarClass(carClass)
      : this.addCarClass(carClass);
  }

  private async addCarClass(carClass: CarClass): Promise<CarClass> {
    const cls = { ...carClass };
    await this.database.handle.transaction(tx => {
      tx.executeSql(
        'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarClasses',
        [],
        (t, r) => {
          cls.id = r.rows.item(0).newId;
        }
      );
      tx.executeSql(
        'INSERT INTO CarClasses (id, name, description, active) VALUES (?, ?, ?, ?)',
        [cls.id, cls.name, cls.description, cls.active ? 1 : 0],
        (t, r) => {}
      );
    });
    return cls;
  }

  private async updateCarClass(carClass: CarClass): Promise<CarClass> {
    this.database.handle.transaction(tx => {
      tx.executeSql(
        'UPDATE CarClasses SET name = ?, description = ?, active = ? WHERE id = ?',
        [
          carClass.name,
          carClass.description,
          carClass.active ? 1 : 0,
          carClass.id
        ],
        (t, r) => {}
      );
    });
    return carClass;
  }

  private async saveCarShowClass(carClass: CarClass): Promise<CarClass> {
    return carClass.id
      ? this.updateCarShowClass(carClass)
      : this.addCarShowClass(carClass);
  }

  private async addCarShowClass(carClass: CarClass): Promise<CarClass> {
    const cls = { ...carClass };
    this.database.handle.transaction(tx => {
      tx.executeSql(
        'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShowClasses',
        [],
        (t, r) => {
          cls.id = r.rows.item(0).newId;
        }
      );
      tx.executeSql(
        'INSERT INTO CarShowClasses (id, name, description, active, carShowRid) VALUES (?, ?, ?, ?, ?)',
        [cls.id, cls.name, cls.description, cls.active ? 1 : 0, cls.carShowRid],
        (t, r) => {}
      );
    });
    return cls;
  }

  private async updateCarShowClass(carClass: CarClass): Promise<CarClass> {
    this.database.handle.transaction(tx => {
      tx.executeSql(
        'UPDATE CarShowClasses SET name = ?, description = ?, active = ?, carShowRid = ? WHERE id = ?',
        [
          carClass.name,
          carClass.description,
          carClass.active ? 1 : 0,
          carClass.carShowRid,
          carClass.id
        ],
        (t, r) => {}
      );
    });
    return carClass;
  }

  private async saveAllCarShowClasses(
    carClasses: Array<CarClass>
  ): Promise<Array<CarClass>> {
    return carClasses[0].id
      ? this.updateAllCarShowClasses(carClasses)
      : this.addAllCarShowClasses(carClasses);
  }

  private async addAllCarShowClasses(
    carClasses: Array<CarClass>
  ): Promise<Array<CarClass>> {
    const classes = [];
    carClasses.forEach(c => classes.push({ ...c }));
    this.database.handle.transaction(tx => {
      let id: number;
      tx.executeSql(
        'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShowClasses',
        [],
        (t, r) => {
          id = r.rows.item(0).newId;
        }
      );
      classes.forEach(c => {
        c.id = id++;
        tx.executeSql(
          'INSERT INTO CarShowClasses (id, name, description, active, carShowRid) VALUES (?, ?, ?, ?, ?)',
          [c.id, c.name, c.description, c.active ? 1 : 0, c.carShowRid],
          (t, r) => {}
        );
      });
    });
    return classes;
  }

  private async updateAllCarShowClasses(
    carClasses: Array<CarClass>
  ): Promise<Array<CarClass>> {
    this.database.handle.transaction(tx => {
      carClasses.forEach(c =>
        tx.executeSql(
          'UPDATE CarShowClasses SET name = ?, description = ?, active = ?, carShowRid = ? WHERE id = ?',
          [c.name, c.description, c.active ? 1 : 0, c.carShowRid, c.id],
          (t, r) => {}
        )
      );
    });
    return carClasses;
  }
}
