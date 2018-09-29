import { Component,  OnInit } from '@angular/core';

import { CarShow } from '../models/car-show';
import { CarShowsService } from '../services/car-shows/car-shows.service';

@Component({
  selector: 'app-car-shows',
  templateUrl: 'car-shows.page.html',
  styleUrls: ['car-shows.page.scss']
})
export class CarShowsPage implements OnInit {
  allCarShows: Array<CarShow>;

  constructor(public carShows: CarShowsService) {}

  ngOnInit() {
    this.carShows.changed.subscribe(() => this.getAllCarShows());
    this.getAllCarShows();
  }

  private getAllCarShows() {
    this.carShows.getAll().subscribe(c => (this.allCarShows = c));
  }
}
