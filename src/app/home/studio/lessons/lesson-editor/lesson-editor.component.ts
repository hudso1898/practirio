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
import { Todo } from 'src/app/interfaces/Todo';

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
  updateInterval;

  isAddingSection: boolean = false;
  isEditingSection: boolean = false;
  sectionTag: string = '';
  sectionSuccess: {name: string, desc: string} = {name: '', desc: ''};
  sectionImprovement: {name: string, desc: string} = {name: '', desc: ''};
  isAddingSectionSuccess: boolean = false;
  isModifyingSectionSuccess: boolean = false;
  isAddingSectionImprovement: boolean = false;
  isModifyingSectionImprovement: boolean = false;

  isAddingTodo: boolean = false;
  isEditingTodo: boolean = false;
  newTodo: Todo;
  todos: Todo[] = [];
  todayISO8601 = this.today();

  lesson: Lesson = {
    id: '1',
    createdBy: this.loginService.user.id,
    date: new Date().toISOString(),
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
  newTodoFactory(): Todo {
    return {
      id: this.userDataService.generateID(), 
      name: '',
      desc: '',
      created: new Date().toISOString(),
      due: undefined,
      finished: false,
      category: '',
      comments: []
    };
  }
  newSection: {name: string, desc: string, tags: string[], comments: string, successes: {name: string, desc: string}[], improvements: {name: string, desc: string}[], sectionComments: Comment[]} = this.newSectionFactory();
  modifySection: {name: string, desc: string, tags: string[], comments: string, successes: {name: string, desc: string}[], improvements: {name: string, desc: string}[], sectionComments: Comment[]} = this.newSectionFactory();
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
          this.userDataService.updateStudio.subscribe(e => {
            this.studio = this.userDataService.studio;
            this.profile = this.userDataService.getStudioProfile(this.studio, this.user);
          })
          console.dir(this.profile)
          this.setupLesson();
        }, 1000);
      }
      else this.setupLesson();
    }, 1000);
    // autosave locally every 5 minutes
    this.updateInterval = setInterval(async() => await this.saveLessonNotes(), (1000 * 60 * 5));
  }

  ngOnDestroy() {
    console.log('Leaving lesson editor');
    clearInterval(this.updateInterval);
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
      this.lesson.sections.forEach(section => {
        section.comments = '';
        section.successes = [];
        section.improvements = [];
      })
    }
    if (await this.userDataService.localGetLessonNotes(this.user.id, this.studio.id, this.lesson.id)) {
      this.lesson = await this.userDataService.localGetLessonNotes(this.user.id, this.studio.id, this.lesson.id);
      if (this.lesson.todos) {
        this.todos = this.lesson.todos;
        console.dir(this.todos)
        delete this.lesson.todos;
      }
      this.loading = false;
    }
    else this.loading = false;
  }
  back() {
    if (this.studio.instructors.find(i => i.id === this.loginService.user.id)) this.router.navigateByUrl('/home/studios/' + this.studio.id + "/lessons/" + this.user.id);
    else this.router.navigateByUrl('/home/studios/' + this.studio.id + '/lessons');
  }
  async submit() {
    const alert = await this.alertCtrl.create({
      cssClass: '',
      header: 'Submit Lesson',
      message: 'Are you sure you want to submit this lesson to Practirio?',
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
            this.submitLesson();
            this.alertCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
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

  // section modifier methods
  modifyExistingSection(name: string) {
    if (this.lesson.sections.find(s => s.name === name)) {
      this.modifySection = Object.assign({}, this.lesson.sections.find(s => s.name === name));
      this.isEditingSection = true;
    }
  }
  closeModifySection() {
    this.modifySection = this.newSectionFactory();
    this.isEditingSection = false;
  }
  addModifySectionTagKeyup(event) {
    if (event.keyCode === 13) this.addModifySectionTag();
  }
  addModifySectionTag() {
    if (!this.modifySection.tags.includes(this.sectionTag)) {
      this.modifySection.tags.push(this.sectionTag);
      this.sectionTag = '';
    }
  }
  removeModifySectionTag(tag: string) {
    if (this.modifySection.tags.includes(tag)) this.modifySection.tags.splice(this.modifySection.tags.indexOf(tag), 1);
  }
  submitModifySectionSuccess() {
    if (!this.isModifySectionSuccessPresent() && this.sectionSuccess.name !== '' && this.sectionSuccess.desc.length <= 500) {
      this.modifySection.successes.push(this.sectionSuccess);
      this.closeSectionSuccess();
    }
  }
  doModifySectionSuccessReorder(event: CustomEvent<ItemReorderEventDetail>) {
    this.modifySection.successes = event.detail.complete(this.modifySection.successes);
  }
  isModifySectionSuccessPresent() {
    return (this.modifySection.successes.find(s => s.name === this.sectionSuccess.name) !== undefined);
  }
  removeModifySectionSuccess(name: string) {
    if (this.modifySection.successes.find(s => s.name === name)) this.modifySection.successes.splice(this.modifySection.successes.findIndex(s => s.name === name), 1);
  }
  modifyModifySectionSuccess(name: string) {
    if (this.modifySection.successes.find(s => s.name === name)) {
      this.sectionSuccess = Object.assign({}, this.modifySection.successes.find(s => s.name === name));
      this.isModifyingSectionSuccess = true;
    }
  }
  closeModifyModifySectionSuccess() {
    this.sectionSuccess = {name: '', desc: ''};
    this.isModifyingSectionSuccess = false;
  }
  submitModifyModifySectionSuccess() {
    this.modifySection.successes[this.modifySection.successes.findIndex(s => s.name === this.sectionSuccess.name)] = this.sectionSuccess;
    this.closeModifyModifySectionSuccess();
  }
  submitModifySectionImprovement() {
    if (!this.isModifySectionImprovementPresent() && this.sectionImprovement.name !== '' && this.sectionImprovement.desc.length <= 500) {
      this.modifySection.improvements.push(this.sectionImprovement);
      this.closeSectionImprovement();
    }
  }
  isModifySectionImprovementPresent() {
    return (this.modifySection.improvements.find(i => i.name === this.sectionImprovement.name) !== undefined);
  }
  doModifySectionImprovementReorder(event: CustomEvent<ItemReorderEventDetail>) {
    this.modifySection.improvements = event.detail.complete(this.modifySection.improvements);
  }
  removeModifySectionImprovement(name: string) {
    if (this.modifySection.improvements.find(i => i.name === name)) this.modifySection.improvements.splice(this.modifySection.improvements.findIndex(i => i.name === name), 1);
  }
  modifyModifySectionImprovement(name: string) {
    if (this.modifySection.improvements.find(s => s.name === name)) {
      this.sectionImprovement = Object.assign({}, this.modifySection.improvements.find(s => s.name === name));
      this.isModifyingSectionImprovement = true;
    }
  }
  closeModifyModifySectionImprovement() {
    this.sectionImprovement = {name: '', desc: ''};
    this.isModifyingSectionImprovement = false;
  }
  submitModifyModifySectionImprovement() {
    this.modifySection.improvements[this.modifySection.improvements.findIndex(s => s.name === this.sectionImprovement.name)] = this.sectionImprovement;
    this.closeModifyModifySectionImprovement();
  }
  submitModifySection() {
    this.lesson.sections[this.lesson.sections.findIndex(s => s.name === this.modifySection.name)] = this.modifySection;
    this.closeModifySection();
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
  modifyNewSectionSuccess(name: string) {
    if (this.newSection.successes.find(s => s.name === name)) {
      this.sectionSuccess = Object.assign({}, this.newSection.successes.find(s => s.name === name));
      this.isModifyingSectionSuccess = true;
    }
  }
  closeModifyNewSectionSuccess() {
    this.sectionSuccess = {name: '', desc: ''};
    this.isModifyingSectionSuccess = false;
  }
  submitModifyNewSectionSuccess() {
    this.newSection.successes[this.newSection.successes.findIndex(s => s.name === this.sectionSuccess.name)] = this.sectionSuccess;
    this.closeModifyNewSectionSuccess();
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
  modifyNewSectionImprovement(name: string) {
    if (this.newSection.improvements.find(s => s.name === name)) {
      this.sectionImprovement = Object.assign({}, this.newSection.improvements.find(s => s.name === name));
      this.isModifyingSectionImprovement = true;
    }
  }
  closeModifyNewSectionImprovement() {
    this.sectionImprovement = {name: '', desc: ''};
    this.isModifyingSectionImprovement = false;
  }
  submitModifyNewSectionImprovement() {
    this.newSection.improvements[this.newSection.improvements.findIndex(s => s.name === this.sectionImprovement.name)] = this.sectionImprovement;
    this.closeModifyNewSectionImprovement();
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

  // Todo handlers

  addNewTodo() {
    this.newTodo = this.newTodoFactory();
    this.isAddingTodo = true;
  }
  closeNewTodo() {
    this.isAddingTodo = false;
  }
  isNewTodoPresent() {
    return (this.todos.find(t => t.name === this.newTodo.name) !== undefined);
  }
  submitNewTodo() {
    if (this.newTodo.name !== '' && !this.isNewTodoPresent()) {
      this.todos.push(this.newTodo);
      this.lesson.newTodos.push(this.newTodo.id);
      this.closeNewTodo();
    }
  }
  editTodo(id: string) {
    if (this.todos.find(t => t.id === id)) {
      this.newTodo = Object.assign({}, this.todos.find(t => t.id === id));
      this.isEditingTodo = true;
    }
  }
  closeEditTodo() {
    this.isEditingTodo = false;
  }
  submitEditTodo() {
    this.todos[this.todos.findIndex(t => t.id === this.newTodo.id)] = this.newTodo;
    this.closeEditTodo();
  }
  removeTodo(id: string) {
    if (this.todos.find(t => t.id === id)) {
      this.todos.splice(this.todos.findIndex(t => t.id === id), 1);
      this.lesson.newTodos.splice(this.lesson.newTodos.indexOf(id), 1);
    }
  }

  todo(id: string) {
    return this.todos.find(t => t.id === id)
  }
  displayDate(date: string) {
    let dateObj = new Date(date);
    let month = (dateObj.getMonth() + 1);
    let day = dateObj.getDate();
    return (month + '/' + day + '/' + dateObj.getFullYear())
  }
  async saveLessonNotes() {
    await this.userDataService.localSaveLessonNotes(Object.assign(this.lesson, {todos: this.todos}), this.user.id, this.studio.id, this.lesson.id);
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
              date: new Date().toISOString(),
              profile: [],
              notes: '',
              notesComments: [],
              sections: [],
              newTodos: []
            }
            this.todos = [];
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

  submitLesson() {
    console.dir(this.lesson);
    console.dir(this.todos);
    if (this.lesson.todos) delete this.lesson.todos;
    this.userDataService.submitLesson(this.loginService.user.id, this.loginService.user.currentSessionId, this.studio.id, this.lesson, this.todos, this.user.id).subscribe((res: {ok: boolean}) => {
      if (res.ok) {
        this.userDataService.localRemoveLessonNotes(this.user.id, this.studio.id, this.lesson.id);
        this.lesson = {
          id: this.lesson.id + 1,
          date: new Date().toISOString(),
          createdBy: this.loginService.user.id,
          profile: [],
          notes: '',
          sections: [],
          newTodos: [],
          notesComments: []
        };
        this.userDataService.triggerUpdateStudio.emit('');
        this.router.navigateByUrl('/home/studios/' + this.studio.id + '/lessons/' + this.user.id);
      }
    });
  }
  get isDarkMode() {
    return this.settingsService.isDarkMode();
  }
  characterCounterColor(str: string, maxlength: number){
    return (str.length < (maxlength * 0.8)) ? "medium" :
      (str.length === maxlength) ? "danger" : "warning";
  }
  // return the ISO 8601 date format of today
  today() {
    let now = new Date();
    return now.getFullYear() + '-' + (((now.getMonth() + 1) < 10) ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)) + '-' 
    + (((now.getDate() + 1) < 10) ? '0' + (now.getDate() + 1) : (now.getDate() + 1)); 
  }
}
