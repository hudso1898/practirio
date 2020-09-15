import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginService } from '../login.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from '../interfaces/User';
import { timeStamp } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.page.html',
  styleUrls: ['./login-dialog.page.scss'],
})
export class LoginDialogPage implements OnInit {

  loginForm: FormGroup;
  errorMessage: String = '';
  constructor(private modalCtrl: ModalController,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router) {
      if(loginService.isTokenPresent()) {
        this.router.navigate(['/home']);
      }
      this.loginForm = formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        staySignedIn: [false]
      })
     }

  ngOnInit() {
  }

  get isLoggingIn(): boolean {
    return this.loginService.isLoggingIn();
  }
  get didLoginFail(): boolean {
    return this.loginService.didLoginFail();
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  login() {
    this.errorMessage = '';
    this.loginService.login(this.loginForm.value['username'], this.loginForm.value['password'], this.loginForm.value['staySignedIn']).subscribe((res: User) => {
      if (res.valid) {
        this.loginService.setLoggedIn(res);
        this.router.navigate(['/home']);
      }
      else {
        setTimeout(() => {
          this.errorMessage = (res.message !== undefined) ? res.message : '';
          this.loginService.failedLogin();
        }, 2000);
      }
    });
  }
  keyUp(event) {
    if(event.keyCode === 13) this.login();
  }

}
