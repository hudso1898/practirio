import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LessonEditorComponent } from './lesson-editor/lesson-editor.component';
import { LessonViewerComponent } from './lesson-viewer/lesson-viewer.component';

import { LessonsPage } from './lessons.page';
import { UserLessonsComponent } from './user-lessons/user-lessons.component';

const routes: Routes = [
  {
    path: '',
    component: LessonsPage,
  },
  {
      path: ':id/new',
      component: LessonEditorComponent
    },
    {
      path: ':id/view/:lessonId',
      component: LessonViewerComponent
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
