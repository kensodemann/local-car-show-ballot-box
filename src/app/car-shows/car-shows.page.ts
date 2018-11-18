import { Component,  OnInit } from '@angular/core';

import { CarClass } from '../models/car-class';
import { CarShow } from '../models/car-show';
import { CarShowsService } from '../services/car-shows';

@Component({
  selector: 'app-car-shows',
  templateUrl: 'car-shows.page.html',
  styleUrls: ['car-shows.page.scss']
})
export class CarShowsPage implements OnInit {
  allCarShows: Array<CarShow>;
  allCarClasses: Array<CarClass>;

  constructor(public carShows: CarShowsService) {}

  async ngOnInit() {
    this.carShows.changed.subscribe(() => this.getAllCarShows());
    this.getAllCarShows();
  }

  private getAllCarShows() {
    this.carShows.getAll().subscribe(c => (this.allCarShows = c));
  }
}
