import { Component, OnInit } from '@angular/core';
import { CarClassesService } from '../services/car-classes';
import { CarShowsService } from '../services/car-shows';
import { CarClass } from '../models/car-class';
import { CarShow } from '../models/car-show';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.page.html',
  styleUrls: ['./debug.page.scss']
})
export class DebugPage implements OnInit {
  currentCarShow: CarShow;
  carClasses: Array<CarClass>;
  carShows: Array<CarShow>;
  carShowClasses: Array<CarClass>;

  constructor(
    private carClassesService: CarClassesService,
    private carShowsService: CarShowsService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.carShowsService.getCurrent().then(c => (this.currentCarShow = c));
    this.carShowsService.getAll().then(c => {
      this.carShowClasses = [];
      this.carShows = c;
      this.carShows.forEach(s =>
        this.carClassesService
          .getAll(s.id)
          .then(cls => Array.prototype.push.apply(this.carShowClasses, cls))
      );
    });
    this.carClassesService.getAll().then(c => (this.carClasses = c));
  }
}
