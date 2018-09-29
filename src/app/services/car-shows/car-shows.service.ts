import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CarClass } from '../../models/car-class';
import { CarShow } from '../../models/car-show';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarShowsService {
  changed: Subject<void>;
  current: CarShow;

  constructor(private http: HttpClient) {
    this.changed = new Subject();
  }

  getCurrent(): Observable<CarShow> {
    return this.http
      .get<CarShow>(`${environment.dataService}/car-shows/current`)
      .pipe(tap(c => (this.current = c && c.id ? c : undefined)));
  }

  save(carShow: CarShow): Observable<CarShow> {
    const url = `${environment.dataService}/car-shows${
      carShow.id ? '/' + carShow.id : ''
    }`;
    return this.http
      .post<CarShow>(url, carShow)
      .pipe(tap(() => this.changed.next()));
  }

  createCarShow(): Observable<CarShow> {
    const date = new Date();
    const dateString = date.toISOString().substr(0, 10);

    return this.http
      .get<Array<CarClass>>(`${environment.dataService}/car-classes`)
      .pipe(
        map(classes => {
          const carShowClasses = classes.filter(cls => cls.active).map(cls => {
            delete cls.id;
            return cls;
          });
          return {
            date: dateString,
            name: `Annual Car Show - ${dateString.substr(0, 4)}`,
            year: date.getFullYear(),
            classes: carShowClasses
          };
        })
      );
  }
}
