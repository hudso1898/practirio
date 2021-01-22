import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { User } from '../interfaces/User';
import { Studio } from '../interfaces/Studio';
import { Profile } from '../interfaces/Profile';
import { Ensemble } from '../interfaces/Ensemble';
import { StudiosComponent } from './studios/studios.component';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private loadedStudios: number = 0;
  constructor(private loginService: LoginService,
    private router: Router,
    private menuCtrl: MenuController,
    private platform: Platform,
    private userDataService: UserDataService) { }

  get user(): User {
    return this.loginService.user;
  }
  ngOnInit() {
    this.init();
  }

  init() {
    if (this.user && !this.loginService.isFetchingUserInfo && !this.loginService.hasFetchedUserInfo) {
      this.loginService.isFetchingUserInfo = true;
          this.loginService.getUserInfo(this.user).subscribe((res: { studios: string[], ensembles: Ensemble[], profiles: Profile[]}) => {
            if (res) {
              this.loginService.setUserInfo([], [], []);
              if (res.studios.length > 0) {
                this.userDataService.isLoadingStudios = true;
                res.studios.map((studio) => {
                  this.loginService.searchStudioById(studio).subscribe((result: { found: boolean, studio: Studio}) => {
                    if (result.found) this.loginService.addStudioToUser(result.studio);
                    this.loadedStudios++;
                    if(this.loadedStudios >= res.studios.length) this.userDataService.isLoadingStudios = false;
                  })
                })
              }
              this.loginService.hasFetchedUserInfo = true;
              this.loginService.isFetchingUserInfo = false;
            }
          });
    }
    else {
      setInterval(() => {
        if (!this.loginService.hasFetchedUserInfo && this.user) {
          this.loginService.isFetchingUserInfo = true;
          this.loginService.getUserInfo(this.user).subscribe((res: { studios: string[], ensembles: Ensemble[], profiles: Profile[]}) => {
            if (res) {
              this.loginService.setUserInfo([], [], []);
              if (res.studios.length > 0) {
                this.userDataService.isLoadingStudios = true;
                res.studios.map((studio) => {
                  this.loginService.searchStudioById(studio).subscribe((result: { found: boolean, studio: Studio}) => {
                    if (result.found) this.loginService.addStudioToUser(result.studio);
                    this.loadedStudios++;
                    if(this.loadedStudios == res.studios.length) this.userDataService.isLoadingStudios = false;
                  })
                })
              }
              // this.loginService.setUserInfo(res.studios, res.ensembles, res.profiles);
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
