import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from 'src/app/interfaces/Profile';
import { Studio } from 'src/app/interfaces/Studio';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';

@Component({
  selector: 'app-user-lessons',
  templateUrl: './user-lessons.component.html',
  styleUrls: ['./user-lessons.component.scss'],
})
export class UserLessonsComponent implements OnInit {

  user: User;
  studio: Studio;
  profile: Profile | {};
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private userDataService: UserDataService, private router: Router, private loginService: LoginService,
    private settingsService: SettingsService) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.user = this.userDataService.getUser(this.route.snapshot.params['id']);
      if (!this.user.id) this.user = this.loginService.user;
      this.studio = this.userDataService.studio;
      this.profile = this.userDataService.getStudioProfile(this.studio, this.user);
      console.dir(this.profile)
      if (this.user.id === "" || this.profile === {}) {
        setTimeout(() => {
          this.user = this.userDataService.getUser(this.route.snapshot.params['id']);
          this.studio = this.userDataService.studio;
          this.profile = this.userDataService.getStudioProfile(this.studio, this.user);
          console.dir(this.profile)
          this.loading = false;
        }, 1000);
      }
      else this.loading = false;
    }, 1000);
  }

  back() {
    if (this.studio.instructors.find(i => i.id === this.loginService.user.id)) this.router.navigateByUrl('/home/studios/' + this.studio.id + "/lessons");
    else this.router.navigateByUrl('/home/studios/' + this.studio.id);
  }
  newLesson() {
    if (this.studio.instructors.find(i => i.id === this.loginService.user.id)) this.router.navigateByUrl('/home/studios/' + this.studio.id + "/lessons/" + this.user.id + "/new");
  }

}
