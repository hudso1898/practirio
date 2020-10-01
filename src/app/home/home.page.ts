import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { User } from '../interfaces/User';
import { Studio } from '../interfaces/Studio';
import { Profile } from '../interfaces/Profile';
import { Ensemble } from '../interfaces/Ensemble';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private loginService: LoginService,
    private router: Router,
    private menuCtrl: MenuController,
    private platform: Platform) { }

  get user(): User {
    return this.loginService.user;
  }
  ngOnInit() {
    if (this.user) {
      this.loginService.isFetchingUserInfo = true;
      this.loginService.getUserInfo(this.user).subscribe((res: { studios: Studio[], ensembles: Ensemble[], profiles: Profile[]}) => {
        if (res) {
          this.loginService.setUserInfo(res.studios, res.ensembles, res.profiles);
          this.loginService.hasFetchedUserInfo = true;
          this.loginService.isFetchingUserInfo = false;
        }
      });
    }
    else {
      setInterval(() => {
        if (!this.loginService.hasFetchedUserInfo && this.user) {
          this.loginService.isFetchingUserInfo = true;
          this.loginService.getUserInfo(this.user).subscribe((res: { studios: Studio[], ensembles: Ensemble[], profiles: Profile[]}) => {
            if (res) {
              this.loginService.setUserInfo(res.studios, res.ensembles, res.profiles);
              this.loginService.hasFetchedUserInfo = true;
              this.loginService.isFetchingUserInfo = false;
            }
          });
        }
      }, 2000);
    }
  }
  logout() {
    this.loginService.logout();
  }
  menuToggle() {
    if (this.isMobile()) this.menuCtrl.close();
  }
  isMobile() {
    return (this.platform.width() < 768);
  }
  get firstname(): String {
    return this.loginService.user.firstname;
  }
  get lastname(): String {
    return this.loginService.user.lastname;
  }
  get username(): String {
    return this.loginService.user.username;
  }

}
