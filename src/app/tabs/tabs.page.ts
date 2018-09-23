import { Component, OnInit } from '@angular/core';

import { CarShowsService } from '../services/car-shows/car-shows.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  noCurrentShow: boolean;

  constructor(private carShows: CarShowsService) {}

  ngOnInit() {
    this.fetchCurrentShow();
    this.carShows.changed.subscribe(() => this.fetchCurrentShow());
  }

  private fetchCurrentShow() {
    this.carShows
      .getCurrent()
      .subscribe(c => (this.noCurrentShow = !(c && c.id)));
  }
}
