import { Component, OnInit } from '@angular/core';

import { CarClass } from '../models/car-class';

@Component({
  selector: 'app-create-new-show',
  templateUrl: './create-new-show.page.html',
  styleUrls: ['./create-new-show.page.scss']
})
export class CreateNewShowPage implements OnInit {
  name: string;
  date: string;
  classes: Array<CarClass>;

  constructor() {}

  ngOnInit() {
    this.date = '2018-08-18';
    this.name = 'Annual Car Show';
    setTimeout(() => {
      this.classes = [{
        id: 1,
        name: 'A',
        description: 'Class A',
        active: true
      }, {
        id: 2,
        name: 'B',
        description: 'Class B',
        active: true
      }, {
        id: 3,
        name: 'C',
        description: 'Class C',
        active: true
      }, {
        id: 4,
        name: 'D',
        description: 'Class D',
        active: true
      }, {
        id: 5,
        name: 'E',
        description: 'Class E',
        active: true
      }, {
        id: 6,
        name: 'F',
        description: 'Class F',
        active: true
      }, {
        id: 7,
        name: 'G',
        description: 'Class G',
        active: true
      }, {
        id: 8,
        name: 'H',
        description: 'Class H',
        active: true
      }, {
        id: 9,
        name: 'I',
        description: 'Class I',
        active: true
      }, {
        id: 10,
        name: 'J',
        description: 'Class J',
        active: true
      }, {
        id: 11,
        name: 'K',
        description: 'Class K',
        active: true
      }, {
        id: 12,
        name: 'L',
        description: 'Class L',
        active: true
      }, {
        id: 13,
        name: 'M',
        description: 'Class M',
        active: true
      }, {
        id: 14,
        name: 'N',
        description: 'Class N',
        active: true
      }, {
        id: 15,
        name: 'O',
        description: 'Class O',
        active: true
      }];
    }, 2000);
  }
}
