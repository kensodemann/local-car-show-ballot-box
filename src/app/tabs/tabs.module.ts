import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { BallotsPageModule } from '../ballots/ballots.module';
import { ResultsPageModule } from '../results/results.module';
import { CarShowsPageModule } from '../car-shows/car-shows.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    BallotsPageModule,
    CarShowsPageModule,
    ResultsPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
