import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { HomePage } from './home.page';
import { StudiosComponent } from './studios/studios.component';
import { EnsemblesComponent } from './ensembles/ensembles.component';
import { EventsComponent } from './events/events.component';
import { PracticeComponent } from './practice/practice.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        component: DefaultComponent
      },
      {
        path: 'studios',
        component: StudiosComponent
      },
      {
        path: 'ensembles',
        component: EnsemblesComponent
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'practice',
        component: PracticeComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
