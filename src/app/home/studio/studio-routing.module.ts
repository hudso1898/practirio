import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LessonEditorComponent } from './lessons/lesson-editor/lesson-editor.component';
import { UserLessonsComponent } from './lessons/user-lessons/user-lessons.component';
import { StudioApplicantsComponent } from './studio-applicants/studio-applicants.component';
import { StudioHomeComponent } from './studio-home/studio-home.component';
import { StudioManageComponent } from './studio-manage/studio-manage.component';
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
      },
      {
        path: 'manage',
        pathMatch: 'full',
        component: StudioManageComponent
      },
      {
        path: 'manage/applicants',
        pathMatch: 'full',
        component: StudioApplicantsComponent
      },
      {
        path: 'lessons',
        loadChildren: () => import('./lessons/lessons.module').then( m => m.LessonsPageModule)
      },
    {
      path: 'lessons/:id/new',
      component: LessonEditorComponent
    },
    {
      path: 'lessons/:id',
      component: UserLessonsComponent
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudioPageRoutingModule {}
