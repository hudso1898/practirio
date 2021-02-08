import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Studio } from 'src/app/interfaces/Studio';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';
import { AlertController, AnimationController, PopoverController } from '@ionic/angular';
import { NewMemberPopoverComponent } from './new-member-popover/new-member-popover.component';
import { ChangeRolePopoverComponent } from './change-role-popover/change-role-popover.component';

@Component({
  selector: 'app-studio-members',
  templateUrl: './studio-members.component.html',
  styleUrls: ['./studio-members.component.scss'],
})
export class StudioMembersComponent implements OnInit {

  constructor(private userDataService: UserDataService, private loginService: LoginService, private settingsService: SettingsService,
    private animationCtrl: AnimationController, private popoverCtrl: PopoverController, private alertController: AlertController) { }

  ngOnInit() {}

  isAddingInstructor: boolean = false;
  isAddingAssistant: boolean = false;
  isAddingStudent: boolean = false;
  @Output() update: EventEmitter<any> = new EventEmitter();
  @ViewChild('instructorPopover')
  instructorPopover: NewMemberPopoverComponent;
  @ViewChild('assistantPopover')
  assistantPopover: NewMemberPopoverComponent;
  @ViewChild('studentPopover')
  studentPopover: NewMemberPopoverComponent;

  get studio(): Studio | undefined {
    return (this.userDataService.isLoadingStudio && !this.userDataService.studio) ? undefined : this.userDataService.studio;
  }
  isInstructor(): boolean {
    return (this.studio) ? this.studio.instructors.findIndex(i => i.id === this.loginService.user.id) !== -1 : false;
  }
  isAssistant(): boolean {
    return (this.studio) ? this.studio.assistants.findIndex(i => i.id === this.loginService.user.id) !== -1 : false;
  }
  getUser(id: string): User {
    return this.userDataService.getUser(id);
  }
  addInstructor() {
    this.isAddingInstructor = true;
    
    setTimeout(() => {
      const animation = this.animationCtrl.create()
    .addElement(document.querySelector('#instructor-popover'))
    .duration(500)
    .iterations(1)
    .fromTo('opacity', 0, 1);
    animation.play();
    if (this.instructorPopover) this.instructorPopover.done.subscribe(ev => {
      if (ev === 'init') this.userDataService.triggerUpdateStudio.emit();
      else this.disableAddInstructor()
    });
    }, 100);
  }
  addAssistant() {
    this.isAddingAssistant = true;
    setTimeout(() => {
      const animation = this.animationCtrl.create()
    .addElement(document.querySelector('#assistant-popover'))
    .duration(500)
    .iterations(1)
    .fromTo('opacity', 0, 1);
    animation.play();
    if (this.assistantPopover) this.assistantPopover.done.subscribe(ev => {
      if (ev === 'init') this.userDataService.triggerUpdateStudio.emit();
      else this.disableAddAssistant()
    });
    }, 100);
    
  }
  addStudent() {
    this.isAddingStudent = true;
    setTimeout(() => {
      const animation = this.animationCtrl.create()
    .addElement(document.querySelector('#student-popover'))
    .duration(500)
    .iterations(1)
    .fromTo('opacity', 0, 1);
    animation.play();
    if (this.studentPopover) this.studentPopover.done.subscribe(ev => {
      if (ev === 'init') this.userDataService.triggerUpdateStudio.emit();
      else this.disableAddStudent()
    });
    }, 100);
  }
  disableAddInstructor() {
      const animation = this.animationCtrl.create()
    .addElement(document.querySelector('#instructor-popover'))
    .duration(500)
    .iterations(1)
    .fromTo('opacity', 1, 0);
    animation.play();
    setTimeout(() => {
      this.isAddingInstructor = false;
    }, 500);
  }
  disableAddAssistant() {
      const animation = this.animationCtrl.create()
    .addElement(document.querySelector('#assistant-popover'))
    .duration(500)
    .iterations(1)
    .fromTo('opacity', 1, 0);
    animation.play();
    setTimeout(() => {
      this.isAddingAssistant = false;
    }, 500);
  }
  disableAddStudent() {
      const animation = this.animationCtrl.create()
    .addElement(document.querySelector('#student-popover'))
    .duration(500)
    .iterations(1)
    .fromTo('opacity', 1, 0);
    animation.play();
    setTimeout(() => {
      this.isAddingStudent = false;
    }, 500);
  }
  onActivate(ref) {
    ref.done.subscribe((role: string) => {
      if (role === 'instructor') this.disableAddInstructor();
      else if (role === 'assistant') this.disableAddAssistant();
      else if (role === 'student') this.disableAddStudent();
    });
  }
  async changeRole(user: User) {
    const popover = await this.popoverCtrl.create({
      component: ChangeRolePopoverComponent,
      componentProps: {
        user: user,
        studio: this.studio,
        currentRole: (this.userDataService.isInstructor(this.studio, user)) ? 'instructor' :
        (this.userDataService.isAssistant(this.studio, user)) ? 'assistant' : 'student',
        emitter: this.update
      }
    })
    await popover.present();
  }
  async removeUser(username: string, id: string) {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Remove User',
      message: 'Are you sure you want to remove <strong>' + username + '</strong> from this studio?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: '',
          handler: (blah) => {
            this.alertController.dismiss();
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.userDataService.removeUserFromStudio(this.loginService.user.id, this.loginService.user.currentSessionId, this.studio.id, id).subscribe((res: {ok: boolean}) => {
              if (res.ok) {
                this.userDataService.triggerUpdateStudio.emit();
                this.alertController.dismiss();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
