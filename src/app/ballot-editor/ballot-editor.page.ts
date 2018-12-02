import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Ballot } from '../models/ballot';
import { CarClass } from '../models/car-class';
import { BallotsService } from '../services/ballots';
import { CarClassesService } from '../services/car-classes';
import { CarShowsService } from '../services/car-shows';
import { VotesService } from '../services/votes';

declare module '../models/car-class' {
  interface CarClass {
    carNumber?: number;
  }
}

@Component({
  selector: 'app-ballot-editor',
  templateUrl: './ballot-editor.page.html',
  styleUrls: ['./ballot-editor.page.scss']
})
export class BallotEditorPage implements OnInit {
  ballot: Ballot;
  classes: Array<CarClass>;

  constructor(
    private ballotsService: BallotsService,
    private carClassesService: CarClassesService,
    private carShowsService: CarShowsService,
    private navController: NavController,
    private votesService: VotesService
  ) {}

  async ngOnInit() {
    this.ballot = { carShowRid: this.carShowsService.current.id };
    this.classes = (await this.carClassesService.getAll(
      this.ballot.carShowRid
    )).filter(c => c.active);
  }

  close() {
    this.navController.goBack();
  }

  async save(): Promise<void> {
    this.ballot = await this.ballotsService.save(this.ballot);
    this.classes.forEach(async c => {
      if (c.carNumber) {
        await this.votesService.save({
          carShowBallotRid: this.ballot.id,
          carShowClassRid: c.id,
          carNumber: c.carNumber
        });
      }
    });
    this.ballot = { carShowRid: this.carShowsService.current.id };
    this.classes.forEach(c => delete c.carNumber);
  }
}
