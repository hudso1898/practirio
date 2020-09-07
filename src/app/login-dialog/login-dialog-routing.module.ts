import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginDialogPage } from './login-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: LoginDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginDialogPageRoutingModule {}
