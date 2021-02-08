import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-resend-verification',
  templateUrl: './resend-verification.component.html',
  styleUrls: ['./resend-verification.component.scss'],
})
export class ResendVerificationComponent implements OnInit {

  constructor(public loginService: LoginService) { }
  email: string = "";
  text: string;

  ngOnInit() {}

  emailKeyup(event) {
    if (event.keyCode === 13) this.resendVerification();
  }
  resendVerification() {
    if (this.email !== "") this.loginService.resendVerification(this.email).subscribe((res: {success: boolean, message: string, error: string}) => {
      if (res.success) {
        this.text = 'Verification email resent! Please check your email.';
      }
      else {
        this.text = res.message;
      }
    }, err => {
      this.text = err.message;
    })
  }
}
