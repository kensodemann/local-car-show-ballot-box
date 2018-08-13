import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { CarShowsPage } from '../car-shows/car-shows.page';
import { BallotsPage } from '../ballots/ballots.page';
import { ResultsPage } from '../results/results.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'car-shows',
        outlet: 'car-shows',
        component: CarShowsPage
      },
      {
        path: 'ballots',
        outlet: 'ballots',
        component: BallotsPage
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
