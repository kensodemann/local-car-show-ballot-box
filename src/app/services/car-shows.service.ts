import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CarShow } from '../models/car-show';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarShowsService {
  private currentCarShow: CarShow;

  constructor(private http: HttpClient) {}

  getCurrent(): Observable<CarShow> {
    if (this.currentCarShow) {
      return of(this.currentCarShow);
    } else {
      return this.http
        .get<CarShow>(`${environment.dataService}/car-shows/current`)
        .pipe(tap(c => (this.currentCarShow = c)));
    }
  }
}
