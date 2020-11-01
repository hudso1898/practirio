import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudioPageRoutingModule } from './studio-routing.module';

import { StudioPage } from './studio.page';
import { StudioHomeComponent } from './studio-home/studio-home.component';
import { StudioMembersComponent } from './studio-members/studio-members.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudioPageRoutingModule
  ],
  declarations: [StudioPage, StudioHomeComponent, StudioMembersComponent]
})
export class StudioPageModule {}
