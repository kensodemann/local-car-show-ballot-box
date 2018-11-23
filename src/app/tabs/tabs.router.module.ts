import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { BallotsPage } from '../ballots/ballots.page';
import { CarShowsPage } from '../car-shows/car-shows.page';
import { DebugPage } from '../debug/debug.page';
import { ResultsPage } from '../results/results.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(car-shows:car-shows)',
        pathMatch: 'full'
      },
      {
        path: 'ballots',
        outlet: 'ballots',
        component: BallotsPage
      },
      {
        path: 'car-shows',
        outlet: 'car-shows',
        component: CarShowsPage
      },
      {
        path: 'debug',
        outlet: 'debug',
        component: DebugPage
      },
      {
        path: 'results',
        outlet: 'results',
        component: ResultsPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(car-shows:car-shows)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
