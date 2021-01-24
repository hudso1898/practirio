import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-approve-popover',
  templateUrl: './approve-popover.component.html',
  styleUrls: ['./approve-popover.component.scss'],
})
export class ApprovePopoverComponent implements OnInit {

  constructor(private popoverController: PopoverController, private userDataService: UserDataService, private loginService: LoginService) { }

  @Input("user") user;
  @Input("emitter") emitter: EventEmitter<any>;

  ngOnInit() {
  }

  confirm(type: string) {
    this.userDataService.addUserToStudio(this.loginService.user.id, this.loginService.user.currentSessionId, this.userDataService.studio.id, this.user, type).subscribe((res: {ok: boolean}) => {
        if (res.ok) this.userDataService.studio.applicants.splice(this.userDataService.studio.applicants.indexOf(this.user), 1);
        this.emitter.emit('init');
        this.popoverController.dismiss();
    })
  }
  dismiss() {
    this.popoverController.dismiss();
  }
}
