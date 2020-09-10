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
  passwordConfirmValidator(passwordControl: AbstractControl): ValidatorFn {
    return ((control: AbstractControl): {[key: string]: any} | null => {
      return (control.value === passwordControl.value) ? null : {
        'passwordError': 'Passwords do not match!'
      }
    });
  }
  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
    this.registerForm = formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      username: ['', [Validators.required, this.usernameValidator(loginService)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['']
    });
    this.registerForm.get('passwordConfirm').setValidators([
      Validators.required,
      this.passwordConfirmValidator(this.registerForm.get('password'))
    ]);
  }

  isFormValid() {
    return this.registerForm.valid && this.registerForm.value['password'] === this.registerForm.value['passwordConfirm'];
  }

  showWarning(formControlName: string) : boolean {
    return (this.registerForm.get(formControlName).touched || this.registerForm.get(formControlName).dirty) && !this.registerForm.get(formControlName).valid;
  }
  getLabelColor(formControlName: string) : string {
    return (this.registerForm.get(formControlName) !== undefined && (this.registerForm.get(formControlName).touched || this.registerForm.get(formControlName).dirty) && !this.registerForm.get(formControlName).valid) ? "danger" : "dark";
  }
  ngOnInit() {
  }
  fieldMissing(): boolean {
    let missing = false;
    Object.entries(this.registerForm.controls).forEach(([key, control]) => {
      if (control.errors !== null) {
        if (control.errors.required !== undefined) {
          missing = true;
        }
      }
    });
    return missing;
  }
  isErrorPresent(controlName: string, errorKey: string): boolean {
    return (this.registerForm.get(controlName).errors !== null && this.registerForm.get(controlName).errors[errorKey] !== undefined)
  }
  register() {
    if (!this.registerForm.valid) return;
    let userData = {
      username: this.registerForm.value['username'],
      password: this.registerForm.value['password'],
      firstname: this.registerForm.value['firstname'],
      lastname: this.registerForm.value['lastname'],
      email: this.registerForm.value['email']
    }
    console.dir(userData);
  }

}
