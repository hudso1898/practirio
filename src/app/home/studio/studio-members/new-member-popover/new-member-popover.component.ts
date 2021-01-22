import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Studio } from 'src/app/interfaces/Studio';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-new-member-popover',
  templateUrl: './new-member-popover.component.html',
  styleUrls: ['./new-member-popover.component.scss'],
})
export class NewMemberPopoverComponent implements OnInit {

  @Input("newMemberRole")
  newMemberRole: string;
  @Input("studio")
  studio: Studio;

  @Output() done: EventEmitter<any> = new EventEmitter();

  query: string = '';
  prevQuery: string = '';
  results: User[] = undefined;
  selected: string = "";
  loading: boolean = false;
  apiComplete: boolean = false;
  apiRunning: boolean = false;
  newMembers: string[] = []; // list of new ids to add

  constructor(private loginService: LoginService, private userDataService: UserDataService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {}
  get role(): string {
    if (this.newMemberRole === 'instructor') return 'Instructor';
    else if (this.newMemberRole === 'assistant') return 'Assistant';
    else return 'Student';
  }
  nameKeyup(event) {
    if (event.keyCode === 13) this.search();
  }
  search() {
    if (this.query === "" || this.query === this.prevQuery) return;
    this.loading = true;
    let names = this.query.split(' ', 2);
    this.loginService.searchUserByNames(names).subscribe((res: {ok: boolean, users: User[]}) => {
      if (res.ok) {
        this.results = res.users;
      }
      else this.results = [];
      this.prevQuery = this.query;
      this.loading = false;
    });
  }
  findMember(user: User) {
    return this.userDataService.isInstructor(this.studio, user)
      || this.userDataService.isAssistant(this.studio, user)
      || this.userDataService.isStudent(this.studio, user);
  }
  getRole(user: User) {
    if (this.userDataService.isInstructor(this.studio, user)) return 'Current Instructor';
    else if (this.userDataService.isAssistant(this.studio, user)) return 'Current Assistant';
    else return 'Current Student';
  }
  toggleAddUser(id: string) {
    if (this.newMembers.includes(id)) this.newMembers.splice(this.newMembers.findIndex(i => i === id),1);
    else this.newMembers.push(id);
  }
  submit() {
    let completed = 0;
    this.apiRunning = true;
    this.newMembers.forEach(member => {
      this.userDataService.addUserToStudio(this.loginService.user.id, this.loginService.user.currentSessionId, this.studio.id,
        member, this.newMemberRole).subscribe(res => {
          completed++;
          if (completed === this.newMembers.length) {
            this.apiComplete = true;
            this.apiRunning = false;
            this.done.emit('init');
            setTimeout(() => {
              this.done.emit(this.newMemberRole);
            }, 4000);
          }
        })
    })
  }

}
