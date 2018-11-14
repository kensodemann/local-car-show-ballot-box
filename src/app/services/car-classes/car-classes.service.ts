import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CarClass } from '../../models/car-class';

@Injectable({
  providedIn: 'root'
})
export class CarClassesService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<CarClass>> {
    return this.http.get<Array<CarClass>>('assets/data/car-classes.json');
  }
}
