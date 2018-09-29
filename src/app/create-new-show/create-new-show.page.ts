import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

import { CarShowsService } from '../services/car-shows';
import { CarShow } from '../models/car-show';

@Component({
  selector: 'app-create-new-show',
  templateUrl: './create-new-show.page.html',
  styleUrls: ['./create-new-show.page.scss']
})
export class CreateNewShowPage implements OnInit {
  carShow: CarShow;

  constructor(
    private carShows: CarShowsService,
    private loadingController: LoadingController,
    private navController: NavController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create();
    loading.present();
    this.carShows.createCarShow().subscribe(c => {
      this.carShow = c;
      loading.dismiss();
    });
  }

  async createShow() {
    const loading = await this.loadingController.create();
    loading.present();
    this.carShows.save(this.carShow).subscribe(() => {
      loading.dismiss();
      this.navController.goBack();
    });
  }
}
