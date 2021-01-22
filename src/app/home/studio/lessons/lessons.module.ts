import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonsPageRoutingModule } from './lessons-routing.module';

import { LessonsPage } from './lessons.page';
import { UserLessonsComponent } from './user-lessons/user-lessons.component';
import { LessonEditorComponent } from './lesson-editor/lesson-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonsPageRoutingModule
  ],
  declarations: [LessonsPage, UserLessonsComponent, LessonEditorComponent]
})
export class LessonsPageModule {}
