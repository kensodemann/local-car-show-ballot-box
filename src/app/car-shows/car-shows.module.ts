import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarShowsPage } from './car-shows.page';
import { NoCurrentShowComponent } from './no-current-show/no-current-show.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: CarShowsPage, outlet: 'car-shows' }
    ])
  ],
  declarations: [CarShowsPage, NoCurrentShowComponent],
  entryComponents: [NoCurrentShowComponent]
})
export class CarShowsPageModule {}
