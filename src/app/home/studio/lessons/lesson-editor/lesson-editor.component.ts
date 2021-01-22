import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/interfaces/Lesson';
import { Profile } from 'src/app/interfaces/Profile';
import { Studio } from 'src/app/interfaces/Studio';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';

@Component({
  selector: 'app-lesson-editor',
  templateUrl: './lesson-editor.component.html',
  styleUrls: ['./lesson-editor.component.scss'],
})
export class LessonEditorComponent implements OnInit {

  user: User;
  studio: Studio;
  lessonNumber: number = 1;
  profile: Profile;
  lesson: Lesson = {
    id: '1',
    date: new Date(),
    profile: [],
    notes: '',
    sections: [],
    newTodos: []
  };
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
      if (this.user.id === "" || !this.profile.id) {
        setTimeout(() => {
          this.user = this.userDataService.getUser(this.route.snapshot.params['id']);
          this.studio = this.userDataService.studio;
          this.profile = this.userDataService.getStudioProfile(this.studio, this.user);
          console.dir(this.profile)
          this.setupLesson();
        }, 1000);
      }
      else this.setupLesson();
    }, 1000);
  }

  setupLesson() {
    this.lessonNumber = (this.profile.lessons.length > 0) ? (this.profile.lessons.length + 1) : 1;
    // import previous lesson data if found
    if (this.profile.lessons.length > 0) {
      let prevLesson = this.profile.lessons[this.profile.lessons.length - 1];
      this.lesson.id = (this.profile.lessons.length + 1).toString();
      this.lesson.profile = prevLesson.profile;
      this.lesson.sections = prevLesson.sections;
    }
    this.loading = false;
  }
  back() {
    if (this.studio.instructors.find(i => i.id === this.loginService.user.id)) this.router.navigateByUrl('/home/studios/' + this.studio.id + "/lessons/" + this.user.id);
    else this.router.navigateByUrl('/home/studios/' + this.studio.id + '/lessons');
  }
  get lessonDate(): string {
    return (this.lesson.date.getMonth() + 1) + "/" + this.lesson.date.getDate() + "/" + this.lesson.date.getFullYear();
  }
  submit() {
    console.dir(this.lesson);
  }

}
