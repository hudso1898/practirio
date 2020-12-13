import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Studio } from 'src/app/interfaces/Studio';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';

@Component({
  selector: 'app-studios',
  templateUrl: './studios.component.html',
  styleUrls: ['./studios.component.scss'],
})
export class StudiosComponent implements OnInit {

  constructor(private platform: Platform, private loginService: LoginService, private userDataService: UserDataService, private settingsService: SettingsService) { }

  ngOnInit() {}

  isMobile() {
    return (this.platform.width() < 768);
  }
  isTallEnough() {
    return (this.platform.height() > 500);
  }
  isInstructor(studio: Studio): boolean {
    return studio.instructors.find((val) => val.id === this.loginService.user.id) !== undefined;
  }
  isAssistant(studio: Studio): boolean {
    return studio.assistants.find((val) => val.id === this.loginService.user.id) !== undefined;
  }
  isStudent(studio: Studio): boolean {
    return studio.students.find((val) => val.id === this.loginService.user.id) !== undefined;
  }
  get isDarkMode(): boolean {
    return this.settingsService.isDarkMode();
  }
  truncateDesc(desc: string) {
   if (desc.length > 147) return desc.slice(0, 147) + '...';
   else return desc;
  }
}
