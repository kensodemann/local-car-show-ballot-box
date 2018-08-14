import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-no-current-show',
  templateUrl: './no-current-show.component.html',
  styleUrls: ['./no-current-show.component.scss']
})
export class NoCurrentShowComponent implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  createShowClicked() {
    this.navCtrl.goForward('create-new-show');
  }
}
