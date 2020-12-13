import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { HomePage } from './home.page';
import { StudiosComponent } from './studios/studios.component';
import { EnsemblesComponent } from './ensembles/ensembles.component';
import { EventsComponent } from './events/events.component';
import { PracticeComponent } from './practice/practice.component';
import { CreateStudioComponent } from './create-studio/create-studio.component';
import { JoinStudioComponent } from './join-studio/join-studio.component';

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
        pathMatch: 'full',
        component: StudiosComponent
      },
      {
        path: 'studios/create',
        pathMatch: 'full',
        component: CreateStudioComponent
      },
      {
        path: 'studios/join',
        pathMatch: 'full',
        component: JoinStudioComponent
      },
      {
        path: 'studios/:id',
        loadChildren: () => import('./studio/studio.module').then( m => m.StudioPageModule)
      },
      {
        path: 'ensembles',
        pathMatch: 'full',
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
  },
  {
    path: 'studio',
    loadChildren: () => import('./studio/studio.module').then( m => m.StudioPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
