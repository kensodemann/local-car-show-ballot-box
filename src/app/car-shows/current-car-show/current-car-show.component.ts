import { Component, Input } from '@angular/core';

import { CarShow } from '../../models/car-show';

@Component({
  selector: 'app-current-car-show',
  templateUrl: './current-car-show.component.html',
  styleUrls: ['./current-car-show.component.scss']
})
export class CurrentCarShowComponent {
  @Input()
  carShow: CarShow;
}
