import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.page.html',
  styleUrls: ['./frontpage.page.scss'],
})
export class FrontpagePage implements OnInit {

  constructor(private loginService: LoginService, private settingsService: SettingsService) { }

  ngOnInit() {
  }

  login() {
    this.loginService.loggedIn = !this.loginService.loggedIn;
  }
  theme() {
    this.settingsService.toggleDarkMode();
  }

}
