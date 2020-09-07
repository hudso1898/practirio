import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginDialogPageRoutingModule } from './login-dialog-routing.module';

import { LoginDialogPage } from './login-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginDialogPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LoginDialogPage]
})
export class LoginDialogPageModule {}
