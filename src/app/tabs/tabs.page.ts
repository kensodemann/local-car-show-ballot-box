import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { CarShowsService } from '../services/car-shows';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  noCurrentShow: boolean;

  constructor(
    private carShows: CarShowsService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.fetchCurrentShow();
    this.carShows.changed.subscribe(() => this.fetchCurrentShow());
  }

  private async fetchCurrentShow() {
    const loading = await this.loadingController.create();
    await loading.present();
    const show = await this.carShows.getCurrent();
    this.noCurrentShow = !(show && show.id);
    loading.dismiss();
  }
}
