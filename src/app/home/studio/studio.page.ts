import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Studio } from 'src/app/interfaces/Studio';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.page.html',
  styleUrls: ['./studio.page.scss'],
})
export class StudioPage implements OnInit {

  studio: Studio;
  constructor(private loginService: LoginService, private route: ActivatedRoute, private settingsService: SettingsService, private userDataService: UserDataService) { }

  ngOnInit() {
    this.userDataService.loadError = false;
    this.userDataService.isLoadingStudio = true;
    this.loginService.searchStudioById(this.route.snapshot.params['id']).subscribe((res: {found: boolean, studio: Studio}) => {
      if (res.found && (res.studio.instructors.findIndex(i => i.id === this.loginService.user.id) !== -1
      || res.studio.assistants.findIndex(a => a.id === this.loginService.user.id) !== -1
      || res.studio.students.findIndex(s => s.id === this.loginService.user.id) !== -1)) {
        this.studio = res.studio;
        this.userDataService.studio = this.studio;
      }
      else this.userDataService.loadError = true;
      this.userDataService.isLoadingStudio = false;
      console.dir(this.studio);
    });
  }

  get studioId(): string {
    return this.route.snapshot.params['id'];
  }

  isInstructor(): boolean {
    return this.studio.instructors.findIndex(i => i.id === this.loginService.user.id) !== -1
  }

}
