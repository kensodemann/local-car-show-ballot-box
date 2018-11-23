import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

import { CarClassesService } from '../services/car-classes';
import { CarShowsService } from '../services/car-shows';
import { CarShow } from '../models/car-show';
import { CarClass } from '../models/car-class';

@Component({
  selector: 'app-create-new-show',
  templateUrl: './create-new-show.page.html',
  styleUrls: ['./create-new-show.page.scss']
})
export class CreateNewShowPage implements OnInit {
  carShow: CarShow;
  carShowClasses: Array<CarClass>;

  constructor(
    private carClasses: CarClassesService,
    private carShows: CarShowsService,
    private loadingController: LoadingController,
    private navController: NavController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create();
    const date = new Date();
    const dateString = date.toISOString().substr(0, 10);

    loading.present();
    this.carShow = {
      date: dateString,
      name: `Annual Car Show - ${dateString.substr(0, 4)}`,
      year: date.getFullYear()
    };
    this.carShowClasses = (await this.carClasses.getAll()).map(c => ({
      name: c.name,
      description: c.description,
      active: c.active
    }));
    loading.dismiss();
  }

  async createShow() {
    const loading = await this.loadingController.create();
    loading.present();
    const newShow = await this.carShows.save(this.carShow);
    await this.carClasses.saveAll(
      this.carShowClasses.map(c => ({ ...c, carShowRid: newShow.id }))
    );
    loading.dismiss();
    this.navController.goBack();
  }

  close() {
    this.navController.goBack();
  }
}
