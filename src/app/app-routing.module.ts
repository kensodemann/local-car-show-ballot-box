import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  {
    path: 'create-new-show',
    loadChildren:
      './create-new-show/create-new-show.module#CreateNewShowPageModule'
  },
  { path: 'ballot-editor', loadChildren: './ballot-editor/ballot-editor.module#BallotEditorPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
