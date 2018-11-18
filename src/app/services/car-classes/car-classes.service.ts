import { Injectable } from '@angular/core';

import { CarClass } from '../../models/car-class';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class CarClassesService {
  constructor(private database: DatabaseService) {}

  async getAll(): Promise<Array<CarClass>> {
    const carClasses: Array<CarClass> = [];

    await this.database.ready();
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
}
