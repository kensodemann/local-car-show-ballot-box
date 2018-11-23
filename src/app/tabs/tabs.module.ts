import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { BallotsPageModule } from '../ballots/ballots.module';
import { CarShowsPageModule } from '../car-shows/car-shows.module';
import { DebugPageModule } from '../debug/debug.module';
import { ResultsPageModule } from '../results/results.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    BallotsPageModule,
    CarShowsPageModule,
    DebugPageModule,
    ResultsPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
