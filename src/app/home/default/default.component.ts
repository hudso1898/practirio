import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {

  constructor(private platform: Platform, private loginService: LoginService, private userDataService: UserDataService, private settingsService: SettingsService) { }

  ngOnInit() {
  }
  isMobile() {
    return (this.platform.width() < 768);
  }
  isTallEnough() {
    return (this.platform.height() > 500);
  }
  get isDarkMode(): boolean {
    return this.settingsService.isDarkMode();
  }
}
