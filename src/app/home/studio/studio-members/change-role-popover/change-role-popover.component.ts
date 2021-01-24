import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Studio } from 'src/app/interfaces/Studio';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-change-role-popover',
  templateUrl: './change-role-popover.component.html',
  styleUrls: ['./change-role-popover.component.scss'],
})
export class ChangeRolePopoverComponent implements OnInit {

  constructor(private popoverController: PopoverController, private userDataService: UserDataService, private loginService: LoginService) { }

  @Input("user") user;
  @Input('currentRole') currentRole: string;
  @Input('studio') studio: Studio;
  @Input("emitter") emitter: EventEmitter<any>;
  
  ngOnInit() {}

  confirm(type: string) {
    this.userDataService.changeStudioRole(this.loginService.user.id, this.loginService.user.currentSessionId, this.studio.id, this.user.id, type).subscribe(res => {
      this.emitter.emit('init');
      this.popoverController.dismiss();
    });
    
  }
  dismiss() {
    this.popoverController.dismiss();
  }

}
