import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudioHomeComponent } from './studio-home/studio-home.component';
import { StudioMembersComponent } from './studio-members/studio-members.component';

import { StudioPage } from './studio.page';

const routes: Routes = [
  {
    path: '',
    component: StudioPage,
    children: [
      {
        path: '',
        component: StudioHomeComponent
      },
      {
        path: 'members',
        component: StudioMembersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudioPageRoutingModule {}
