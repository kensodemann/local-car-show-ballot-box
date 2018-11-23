import { Component, Input, OnInit } from '@angular/core';

import { CarClassesService } from '../../services/car-classes';
import { CarClass } from '../../models/car-class';
import { CarShow } from '../../models/car-show';

@Component({
  selector: 'app-current-car-show',
  templateUrl: './current-car-show.component.html',
  styleUrls: ['./current-car-show.component.scss']
})
export class CurrentCarShowComponent implements OnInit {
  @Input() carShow: CarShow;
  carShowClasses: Array<CarClass>;

  constructor(private carClassesService: CarClassesService) {}

  async ngOnInit() {
    this.carShowClasses = await this.carClassesService.getAll(this.carShow.id);
  }
}
