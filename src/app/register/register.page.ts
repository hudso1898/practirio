import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  usernameValidator(loginService: LoginService): ValidatorFn {
    return ((control: AbstractControl): {[key: string]: any} | null => {
      return (loginService.usernames.find((val) => val === control.value) == undefined) ? null : {
        'usernameError': 'Username ' + control.value + ' is already taken!'
      }
    });
  }
  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
    this.registerForm = formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      username: ['', [Validators.required, Validators.minLength(4), this.usernameValidator(loginService)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required]
    });
  }

  isFormValid() {
    return this.registerForm.valid && this.registerForm.value['password'] === this.registerForm.value['passwordConfirm'];
  }

  ngOnInit() {
  }

}
