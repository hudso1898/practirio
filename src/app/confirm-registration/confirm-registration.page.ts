import { Component, OnInit } from '@angular/core';
import { LoginDialogPage } from '../login-dialog/login-dialog.page';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.page.html',
  styleUrls: ['./confirm-registration.page.scss'],
})
export class ConfirmRegistrationPage implements OnInit {

  constructor(private loginService: LoginService, private router: Router, private userDataService: UserDataService) {
    this.userDataService.headerMessage = '';
    if(loginService.isTokenPresent()) {
      this.router.navigate(['/home']);
    }
   }

  ngOnInit() {
  }

}
