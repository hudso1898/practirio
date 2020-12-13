import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { DefaultComponent } from './default/default.component';
import { EnsemblesComponent } from './ensembles/ensembles.component';
import { EventsComponent } from './events/events.component';
import { PracticeComponent } from './practice/practice.component';
import { StudiosComponent } from './studios/studios.component';
import { CreateStudioComponent } from './create-studio/create-studio.component';
import { JoinStudioComponent } from './join-studio/join-studio.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, DefaultComponent, EnsemblesComponent, EventsComponent, PracticeComponent, StudiosComponent, CreateStudioComponent, JoinStudioComponent]
})
export class HomePageModule {}
