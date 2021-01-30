import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Lesson } from 'src/app/interfaces/Lesson';
import { Profile } from 'src/app/interfaces/Profile';
import { Studio } from 'src/app/interfaces/Studio';
import { Todo } from 'src/app/interfaces/Todo';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/login.service';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';

@Component({
  selector: 'app-lesson-viewer',
  templateUrl: './lesson-viewer.component.html',
  styleUrls: ['./lesson-viewer.component.scss'],
})
export class LessonViewerComponent implements OnInit {
  user: User;
  studio: Studio;
  profile: Profile;

  lesson: Lesson;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private userDataService: UserDataService, private router: Router, private loginService: LoginService,
    private settingsService: SettingsService, private alertCtrl: AlertController, private toaster: ToasterServiceService) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.user = this.userDataService.getUser(this.route.snapshot.params['id']);
      this.studio = this.userDataService.studio;
      this.profile = this.userDataService.getStudioProfile(this.studio, this.user);
      if (this.user.id === "" || !this.profile.id) {
        setTimeout(() => {
          this.user = this.userDataService.getUser(this.route.snapshot.params['id']);
          this.studio = this.userDataService.studio;
          this.profile = this.userDataService.getStudioProfile(this.studio, this.user);
          this.userDataService.updateStudio.subscribe(e => {
            this.studio = this.userDataService.studio;
            this.profile = this.userDataService.getStudioProfile(this.studio, this.user);
          });
          this.setupLesson();
        }, 1000);
      }
      else this.setupLesson();
    }, 1000);
  }

  async setupLesson() {
    if (this.profile.lessons.length > 0) {
      this.lesson = this.profile.lessons.find(l => l.id == this.route.snapshot.params['lessonId']);
    }
    this.loading = false;
  }
  back() {
    if (this.studio.instructors.find(i => i.id === this.loginService.user.id)) this.router.navigateByUrl('/home/studios/' + this.studio.id + "/lessons/" + this.user.id);
    else this.router.navigateByUrl('/home/studios/' + this.studio.id + '/lessons');
  }
  
  todo(id: string) {
    return this.profile.todos.find(t => t.id === id)
  }
  displayDate(date: string) {
    let dateObj = new Date(date);
    let month = (dateObj.getMonth() + 1);
    let day = dateObj.getDate();
    return (month + '/' + day + '/' + dateObj.getFullYear())
  }

}
