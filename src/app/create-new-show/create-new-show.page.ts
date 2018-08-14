import { Component, OnInit } from '@angular/core';

import { CarShowCarClass } from '../models/car-show-car-class';

@Component({
  selector: 'app-create-new-show',
  templateUrl: './create-new-show.page.html',
  styleUrls: ['./create-new-show.page.scss']
})
export class CreateNewShowPage implements OnInit {
  name: string;
  date: string;
  classes: Array<CarShowCarClass>;

  constructor() {}

  ngOnInit() {
    this.date = '2018-08-18';
    this.name = 'Annual Car Show';
    setTimeout(() => {
      this.classes = [{
        id: 1,
        name: 'A',
        description: 'Class A',
        includeInShow: true
      }, {
        id: 2,
        name: 'B',
        description: 'Class B',
        includeInShow: true
      }, {
        id: 3,
        name: 'C',
        description: 'Class C',
        includeInShow: true
      }, {
        id: 4,
        name: 'D',
        description: 'Class D',
        includeInShow: true
      }, {
        id: 5,
        name: 'E',
        description: 'Class E',
        includeInShow: true
      }, {
        id: 6,
        name: 'F',
        description: 'Class F',
        includeInShow: true
      }, {
        id: 7,
        name: 'G',
        description: 'Class G',
        includeInShow: true
      }, {
        id: 8,
        name: 'H',
        description: 'Class H',
        includeInShow: true
      }, {
        id: 9,
        name: 'I',
        description: 'Class I',
        includeInShow: true
      }, {
        id: 10,
        name: 'J',
        description: 'Class J',
        includeInShow: true
      }, {
        id: 11,
        name: 'K',
        description: 'Class K',
        includeInShow: true
      }, {
        id: 12,
        name: 'L',
        description: 'Class L',
        includeInShow: true
      }, {
        id: 13,
        name: 'M',
        description: 'Class M',
        includeInShow: true
      }, {
        id: 14,
        name: 'N',
        description: 'Class N',
        includeInShow: true
      }, {
        id: 15,
        name: 'O',
        description: 'Class O',
        includeInShow: true
      }];
    }, 2000);
  }
}
