import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudioPageRoutingModule } from './studio-routing.module';

import { StudioPage } from './studio.page';
import { StudioHomeComponent } from './studio-home/studio-home.component';
import { StudioMembersComponent } from './studio-members/studio-members.component';
import { StudioManageComponent } from './studio-manage/studio-manage.component';
import { StudioApplicantsComponent } from './studio-applicants/studio-applicants.component';
import { ApprovePopoverComponent } from './studio-applicants/approve-popover/approve-popover.component';
import { NewMemberPopoverComponent } from './studio-members/new-member-popover/new-member-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudioPageRoutingModule
  ],
  declarations: [StudioPage, StudioHomeComponent, StudioMembersComponent, StudioManageComponent, StudioApplicantsComponent, ApprovePopoverComponent, NewMemberPopoverComponent]
})
export class StudioPageModule {}
