import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CarShow } from '../models/car-show';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarShowsService {
  currentChanged: Subject<CarShow>;

  constructor(private http: HttpClient) {
    this.currentChanged = new Subject();
  }

  getCurrent(): Observable<CarShow> {
    return this.http
      .get<CarShow>(`${environment.dataService}/car-shows/current`)
      .pipe(tap(c => this.currentChanged.next(c)));
  }
}
