import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonsPage } from './lessons.page';
import { UserLessonsComponent } from './user-lessons/user-lessons.component';

const routes: Routes = [
  {
    path: '',
    component: LessonsPage,
  },
  {
    path: ':id',
    component: UserLessonsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonsPageRoutingModule {}
