import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CarClass } from '../../models/car-class';
import { CarShow } from '../../models/car-show';
import { DatabaseService } from '../database';

@Injectable({
  providedIn: 'root'
})
export class CarShowsService {
  changed: Subject<void>;
  current: CarShow;

  constructor(private database: DatabaseService) {
    this.changed = new Subject();
  }

  async getAll(): Promise<Array<CarShow>> {
    const carShows: Array<CarShow> = [];
    await this.database.ready();
    await this.database.handle.transaction(tx => {
      tx.executeSql('SELECT * FROM CarShows ORDER BY year', [], (t, r) => {
        for (let idx = 0; idx < r.rows.length; idx++) {
          const show = r.rows.item(idx);
          carShows.push({
            id: show.id,
            name: show.name,
            date: show.date,
            year: show.year,
            classes: []
          });
        }
      });
    });
    return carShows;
  }

  async getCurrent(): Promise<CarShow> {
    const year = new Date().getFullYear();
    await this.database.ready();
    await this.database.handle.transaction(tx => {
      tx.executeSql('SELECT * FROM CarShows WHERE year = ?', [year], (t, r) => {
        if (r.rows.length > 0) {
          const show = r.rows.item(0);
          this.current = {
            id: show.id,
            name: show.name,
            date: show.date,
            year: show.year
          };
        } else {
          this.current = undefined;
        }
      });
    });
    return this.current;
  }

  async save(carShow: CarShow): Promise<CarShow> {
    await this.database.ready();
    if (carShow.id) {
      return this.updateExistingShow(carShow);
    } else {
      return this.saveNewShow(carShow);
    }
  }

  private async saveNewShow(carShow: CarShow): Promise<CarShow> {
    const show: CarShow = { ...carShow };
    this.database.handle.transaction(tx => {
      tx.executeSql(
        'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShows',
        [],
        (t, r) => {
          show.id = r.rows.item(0).newId;
        }
      );
      tx.executeSql(
        'INSERT INTO CarShows (id, name, date, year) VALUES (?, ?, ?, ?)',
        [show.id, show.name, show.date, show.year],
        (t, r) => {}
      );
    });
    return show;
  }

  private async updateExistingShow(carShow: CarShow): Promise<CarShow> {
    this.database.handle.transaction(tx => {
      tx.executeSql(
        'UPDATE CarShows SET name = ?, date = ?, year = ? WHERE id = ?',
        [carShow.name, carShow.date, carShow.year, carShow.id],
        (t, r) => {}
      );
    });
    return carShow;
  }
}
