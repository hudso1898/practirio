import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/interfaces/Lesson';
import { Profile } from 'src/app/interfaces/Profile';
import { Studio } from 'src/app/interfaces/Studio';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';
import { ItemReorderEventDetail } from '@ionic/core';
import { AlertController } from '@ionic/angular';
import { ToasterServiceService } from 'src/app/services/toaster-service.service';

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
  isAddingProfileItem: boolean = false;
  isEditingProfileItem: boolean = false;
  lesson: Lesson = {
    id: '1',
    date: new Date(),
    profile: [],
    notes: '',
    sections: [],
    newTodos: []
  };
  loading: boolean = true;
  newProfileItem: {name: string, content: string} = {name: '', content: ''};
  modifiedProfileItem: {name: string, content: string} = {name: '', content: ''};

  constructor(private route: ActivatedRoute, private userDataService: UserDataService, private router: Router, private loginService: LoginService,
    private settingsService: SettingsService, private alertCtrl: AlertController, private toaster: ToasterServiceService) {

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

  async setupLesson() {
    this.lessonNumber = (this.profile.lessons.length > 0) ? (this.profile.lessons.length + 1) : 1;
    // import previous lesson data if found
    if (this.profile.lessons.length > 0) {
      let prevLesson = this.profile.lessons[this.profile.lessons.length - 1];
      this.lesson.id = (this.profile.lessons.length + 1).toString();
      this.lesson.profile = prevLesson.profile;
      this.lesson.sections = prevLesson.sections;
    }
    if (await this.userDataService.localGetLessonNotes(this.user.id, this.lesson.id)) {
      this.lesson = await this.userDataService.localGetLessonNotes(this.user.id, this.lesson.id);
      this.lesson.date = new Date(this.lesson.date);
      this.loading = false;
    }
    else this.loading = false;
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
  addNewProfileItem() {
    this.newProfileItem = {name: '', content: ''};
    this.isAddingProfileItem = true;
  }
  closeNewProfileItem() {
    this.newProfileItem = {name: '', content: ''};
    this.isAddingProfileItem = false;
  }
  submitNewProfileItem() {
    if (!this.isProfileItemPresent() && this.newProfileItem.name !== '' && this.newProfileItem.content !== '') {
      this.lesson.profile.push({name: this.newProfileItem.name, content: this.newProfileItem.content});
      this.closeNewProfileItem();
    }
  }
  // return true if the item should not be added
  isProfileItemPresent(): boolean {
    return (this.lesson.profile.find(item => item.name === this.newProfileItem.name) !== undefined);
  }
  doProfileReorder(event: CustomEvent<ItemReorderEventDetail>) {
    this.lesson.profile = event.detail.complete(this.lesson.profile);
  }
  removeProfileItem(name: string) {
    this.lesson.profile.splice(this.lesson.profile.findIndex(p => p.name === name), 1);
  }
  modifyProfileItem(name: string) {
    if (this.lesson.profile.find(p => p.name === name)) {
      this.modifiedProfileItem = Object.assign({}, this.lesson.profile.find(p => p.name === name));
      this.isEditingProfileItem = true;
    }
  }
  submitModifyProfileItem() {
    if (this.modifiedProfileItem.content !== '') {
      this.lesson.profile[this.lesson.profile.findIndex(p => p.name === this.modifiedProfileItem.name)].content = this.modifiedProfileItem.content;
      this.closeModifyProfileItem();
    }
  }
  closeModifyProfileItem() {
    this.modifiedProfileItem = {name: '', content: ''};
    this.isEditingProfileItem = false;
  }
  async saveLessonNotes() {
    await this.userDataService.localSaveLessonNotes(this.lesson, this.user.id, this.lesson.id);
  }
  async clearLessonNotes() {
    const alert = await this.alertCtrl.create({
      cssClass: '',
      header: 'Clear Lesson Data',
      message: 'Are you sure you want to clear the lesson editor?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: '',
          handler: (blah) => {
            this.alertCtrl.dismiss();
          }
        }, {
          text: 'Confirm',
          handler: async() => {
            this.lesson = {
              id: this.lesson.id,
              date: new Date(),
              profile: [],
              notes: '',
              sections: [],
              newTodos: []
            }
            await this.toaster.toast('Lesson editor cleared.');
            this.alertCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
  isDarkMode() {
    return this.settingsService.isDarkMode();
  }
}
