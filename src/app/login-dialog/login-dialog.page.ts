import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginService } from '../login.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.page.html',
  styleUrls: ['./login-dialog.page.scss'],
})
export class LoginDialogPage implements OnInit {

  username = '';
  password = '';
  constructor(private modalCtrl: ModalController,
    private loginService: LoginService) {
     }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  loginValid() {
    console.log(this.username)
    console.log(this.password)
    return (this.username.length > 0 && this.password.length > 0);
  }
  loginSubmit() {

  }

}
