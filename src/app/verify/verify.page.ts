import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PracServResponse } from '../interfaces/PracServResponse';
import { LoginService } from '../login.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {

  loading: boolean = true;
  verified: boolean = false;
  message: string = '';
  constructor(private route: ActivatedRoute, private router: Router, private loginService: LoginService, private userDataService: UserDataService) {
    if(loginService.isTokenPresent()) {
      this.router.navigate(['/home']);
    }
   }

  ngOnInit() {
    this.userDataService.headerMessage = '';
    if (this.route.snapshot.queryParams.vid !== undefined) {
      this.loginService.verifyAccount(this.route.snapshot.queryParams.vid).subscribe((res: { ok: boolean, message: string }) => {
        if (res.ok) {
          this.verified = true;
        }
        else {
          this.message = res.message;
        }
        this.loading = false;
      }, (err: PracServResponse) => {
        this.loading = false;
        this.message = err.message;
      });
    }
    else {
      this.loading = false;
      this.message = 'This verification link is misformatted.';
    }
  }

}
