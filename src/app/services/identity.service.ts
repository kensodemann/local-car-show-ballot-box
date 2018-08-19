import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private user: User;
  constructor(private http: HttpClient) {}

  get(): Observable<User> {
    if (!this.user) {
      return this.http
        .get(`${environment.dataService}/users/current`)
        .pipe(tap(u => (this.user = u as User))) as Observable<User>;
    } else {
      return of(this.user);
    }
  }

  set(user: User): void {
    this.user = user;
  }

  remove(): void {
    this.user = undefined;
  }
}
