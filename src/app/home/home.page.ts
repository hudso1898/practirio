import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';

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

  ngOnInit() {
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
