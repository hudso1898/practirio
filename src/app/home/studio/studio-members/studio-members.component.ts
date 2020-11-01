import { Component, OnInit } from '@angular/core';
import { Studio } from 'src/app/interfaces/Studio';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-studio-members',
  templateUrl: './studio-members.component.html',
  styleUrls: ['./studio-members.component.scss'],
})
export class StudioMembersComponent implements OnInit {

  constructor(private userDataService: UserDataService, private loginService: LoginService) { }

  ngOnInit() {}

  get studio(): Studio | undefined {
    return (this.userDataService.isLoadingStudio) ? undefined : this.userDataService.studio;
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

}
