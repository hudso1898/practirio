import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ResendVerificationComponent } from './resend-verification/resend-verification.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./frontpage/frontpage.module').then( m => m.FrontpagePageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuardService]
  }, {
    path: 'login',
    loadChildren: () => import('./login-dialog/login-dialog.module').then( m => m.LoginDialogPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'confirmRegistration',
    loadChildren: () => import('./confirm-registration/confirm-registration.module').then( m => m.ConfirmRegistrationPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./verify/verify.module').then( m => m.VerifyPageModule)
  },
  {
    path: 'resendVerification',
    component: ResendVerificationComponent
  },
  {
    path: 'sessionExpired',
    loadChildren: () => import('./session-expired/session-expired.module').then( m => m.SessionExpiredPageModule)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
