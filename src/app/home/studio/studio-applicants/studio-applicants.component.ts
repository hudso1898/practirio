import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ApprovePopoverComponent } from './approve-popover/approve-popover.component';

@Component({
  selector: 'app-studio-applicants',
  templateUrl: './studio-applicants.component.html',
  styleUrls: ['./studio-applicants.component.scss'],
})
export class StudioApplicantsComponent implements OnInit {

  constructor(private userDataService: UserDataService, private loginService: LoginService, private alertController: AlertController, private popoverController: PopoverController) { }

  ngOnInit() {}

  getUser(id: string): User {
    return this.userDataService.getUser(id);
  }

  async confirm(id: string) {
    let popover = await this.popoverController.create({
      component: ApprovePopoverComponent,
      componentProps: {
        user: id
      }
    });
    await popover.present();
  }

  async deny(username: string, id: string) {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Remove Applicant',
      message: 'Are you sure you want to remove <strong>' + username + '</strong>\'s application?',
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
            this.userDataService.denyStudioApplication(this.loginService.user.id, this.loginService.user.currentSessionId, this.userDataService.studio.id, id).subscribe((res: {ok: boolean}) => {
              if (res.ok) this.userDataService.studio.applicants.splice(this.userDataService.studio.applicants.indexOf(id), 1);
              this.alertController.dismiss();
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
