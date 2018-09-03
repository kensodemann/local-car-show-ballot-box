import { Component, OnInit } from '@angular/core';

import { CarShow } from '../models/car-show';
import { CarShowsService } from '../services/car-shows.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  noCurrentShow: boolean;

  constructor(private carShows: CarShowsService) {}

  ngOnInit() {
    this.carShows.getCurrent().subscribe();
    this.carShows.currentChanged.subscribe(
      show => (this.noCurrentShow = !show)
    );
  }
}
