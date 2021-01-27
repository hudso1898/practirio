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
import { Comment } from 'src/app/interfaces/Comment';

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
  isAddingSection: boolean = false;
  isEditingSection: boolean = false;
  sectionTag: string = '';
  sectionSuccess: {name: string, desc: string} = {name: '', desc: ''};
  sectionImprovement: {name: string, desc: string} = {name: '', desc: ''};
  isAddingSectionSuccess: boolean = false;
  isAddingSectionImprovement: boolean = false;

  lesson: Lesson = {
    id: '1',
    createdBy: this.loginService.user.id,
    date: new Date(),
    profile: [],
    notes: '',
    notesComments: [],
    sections: [],
    newTodos: []
  };
  loading: boolean = true;
  newProfileItem: {name: string, content: string} = {name: '', content: ''};
  newSectionFactory() {
    return {
      name: '',
      desc: '', 
      tags: [],
      comments: '',
      successes: [],
      improvements: [],
      sectionComments: []
    }
  }
  newSection: {name: string, desc: string, tags: string[], comments: string, successes: {name: string, desc: string}[], improvements: {name: string, desc: string}[], sectionComments: Comment[]} = this.newSectionFactory();
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
    // autosave locally every 5 minutes
    setInterval(async() => await this.saveLessonNotes(), (1000 * 60 * 5));
  }

  async setupLesson() {
    if (!this.studio.instructors.find(i => i.id === this.loginService.user.id)) {
      this.router.navigateByUrl('/home/studios/' + this.studio.id + '/lessons');
    }
    this.lessonNumber = (this.profile.lessons.length > 0) ? (this.profile.lessons.length + 1) : 1;
    // import previous lesson data if found
    if (this.profile.lessons.length > 0) {
      let prevLesson = this.profile.lessons[this.profile.lessons.length - 1];
      this.lesson.id = (this.profile.lessons.length + 1).toString();
      this.lesson.profile = prevLesson.profile;
      this.lesson.sections = prevLesson.sections;
    }
    if (await this.userDataService.localGetLessonNotes(this.user.id, this.studio.id, this.lesson.id)) {
      this.lesson = await this.userDataService.localGetLessonNotes(this.user.id, this.studio.id, this.lesson.id);
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
  keyUpNewProfileItem(event) {
    if (event.keyCode === 13) this.submitNewProfileItem();
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
  keyUpModifyProfileItem(event) {
    if (event.keyCode === 13) this.submitModifyProfileItem();
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

  addSection() {
    this.newSection = this.newSectionFactory();
    this.isAddingSection = true;
  }
  closeNewSection() {
    this.isAddingSection = false;
  }
  addSectionTagKeyup(event) {
    if (event.keyCode === 13) this.addSectionTag();
  }
  addSectionTag() {
    if (!this.newSection.tags.includes(this.sectionTag)) {
      this.newSection.tags.push(this.sectionTag);
      this.sectionTag = '';
    }
  }
  removeSectionTag(tag: string) {
    if (this.newSection.tags.includes(tag)) this.newSection.tags.splice(this.newSection.tags.indexOf(tag), 1);
  }
  addSectionSuccess() {
    this.isAddingSectionSuccess = true;
  }
  closeSectionSuccess() {
    this.sectionSuccess = {name: '', desc: ''};
    this.isAddingSectionSuccess = false;
  }
  submitNewSectionSuccess() {
    if (!this.isNewSectionSuccessPresent() && this.sectionSuccess.name !== '' && this.sectionSuccess.desc.length <= 500) {
      this.newSection.successes.push(this.sectionSuccess);
      this.closeSectionSuccess();
    }
  }
  doNewSectionSuccessReorder(event: CustomEvent<ItemReorderEventDetail>) {
    this.newSection.successes = event.detail.complete(this.newSection.successes);
  }
  isNewSectionSuccessPresent() {
    return (this.newSection.successes.find(s => s.name === this.sectionSuccess.name) !== undefined);
  }
  removeNewSectionSuccess(name: string) {
    if (this.newSection.successes.find(s => s.name === name)) this.newSection.successes.splice(this.newSection.successes.findIndex(s => s.name === name), 1);
  }
  addSectionImprovement() {
    this.isAddingSectionImprovement = true;
  }
  closeSectionImprovement() {
    this.sectionImprovement = {name: '', desc: ''};
    this.isAddingSectionImprovement = false;
  }
  submitNewSectionImprovement() {
    if (!this.isNewSectionImprovementPresent() && this.sectionImprovement.name !== '' && this.sectionImprovement.desc.length <= 500) {
      this.newSection.improvements.push(this.sectionImprovement);
      this.closeSectionImprovement();
    }
  }
  isNewSectionImprovementPresent() {
    return (this.newSection.improvements.find(i => i.name === this.sectionImprovement.name) !== undefined);
  }
  doNewSectionImprovementReorder(event: CustomEvent<ItemReorderEventDetail>) {
    this.newSection.improvements = event.detail.complete(this.newSection.improvements);
  }
  removeNewSectionImprovement(name: string) {
    if (this.newSection.improvements.find(i => i.name === name)) this.newSection.improvements.splice(this.newSection.improvements.findIndex(i => i.name === name), 1);
  }
  isNewSectionPresent() {
    return (this.lesson.sections.find(s => s.name === this.newSection.name) !== undefined);
  }
  submitNewSection() {
    if (!this.isNewSectionPresent() && this.newSection.name !== '') {
      this.lesson.sections.push(this.newSection);
      this.closeNewSection();
    }
  }

  async saveLessonNotes() {
    await this.userDataService.localSaveLessonNotes(this.lesson, this.user.id, this.studio.id, this.lesson.id);
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
              createdBy: this.loginService.user.id,
              date: new Date(),
              profile: [],
              notes: '',
              notesComments: [],
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
  async clearSection(name: string) {
    const alert = await this.alertCtrl.create({
      cssClass: '',
      header: 'Delete Section',
      message: 'Are you sure you want to remove this section?',
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
            if (this.lesson.sections.find(s => s.name === name)) {
              this.lesson.sections.splice(this.lesson.sections.findIndex(s => s.name === name), 1);
              await this.toaster.toast('Section cleared.');
            }
            this.alertCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
  get isDarkMode() {
    return this.settingsService.isDarkMode();
  }
  characterCounterColor(str: string, maxlength: number){
    return (str.length < (maxlength * 0.8)) ? "medium" :
      (str.length === maxlength) ? "danger" : "warning";
  }
}
