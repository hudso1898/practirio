import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginService } from '../login.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.page.html',
  styleUrls: ['./login-dialog.page.scss'],
})
export class LoginDialogPage implements OnInit {

  loginForm: FormGroup;
  constructor(private modalCtrl: ModalController,
    private loginService: LoginService,
    private formBuilder: FormBuilder) {
      this.loginForm = formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      })
     }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
  login() {
    this.loginService.login(this.loginForm.value['username'], this.loginForm.value['password']).subscribe(res => {
      console.dir(res)
    });
  }

}
