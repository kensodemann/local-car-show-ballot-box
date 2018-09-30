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

  parseDate(evt: any) {
    if (typeof evt.target.value === 'object') {
      const dt = evt.target.value;
      const yearRegEx = new RegExp(this.carShow.year.toString(), 'g');
      this.carShow.year = dt.year.value;
      this.carShow.name = this.carShow.name.replace(
        yearRegEx,
        this.pad(dt.year.value, '0000')
      );
      this.carShow.date = `${this.pad(dt.year.value, '0000')}-${this.pad(
        dt.month.value,
        '00'
      )}-${this.pad(dt.day.value, '00')}`;
    }
  }

  private pad(n: number, mask: string): string {
    const vstr = n.toString();
    return mask.substring(0, mask.length - vstr.length) + vstr;
  }
}
