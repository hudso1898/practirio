import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { DefaultComponent } from './default/default.component';
import { EnsemblesComponent } from './ensembles/ensembles.component';
import { EventsComponent } from './events/events.component';
import { PracticeComponent } from './practice/practice.component';
import { StudiosComponent } from './studios/studios.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, DefaultComponent, EnsemblesComponent, EventsComponent, PracticeComponent, StudiosComponent]
})
export class HomePageModule {}
