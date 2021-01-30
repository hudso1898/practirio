import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Studio } from 'src/app/interfaces/Studio';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.page.html',
  styleUrls: ['./lessons.page.scss'],
})
export class LessonsPage implements OnInit {

  studio: Studio;
  uid: string = "";
  constructor(private userDataService: UserDataService, private route: ActivatedRoute, private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.init();
  }
  ngAfterViewChecked() {
    if (this.userDataService.studio && this.userDataService.studio.id !== this.route.snapshot.params['id']) this.init();
  }
  public init() {
    this.studio = this.userDataService.studio;
    this.userDataService.updateStudio.subscribe(e => {
      this.studio = this.userDataService.studio;
    });
    if(!this.isInstructor()) this.uid = this.loginService.user.id;
  }

  get studioId(): string {
    
    return this.studio.id;
  }

  isInstructor(): boolean {
    return this.studio.instructors.findIndex(i => i.id === this.loginService.user.id) !== -1
  }

  getUser(id) {
    return this.userDataService.getUser(id);
  }
  switchToUser(id: string) {
    this.router.navigateByUrl('/home/studios/' + this.studio.id + '/lessons/' + id);
  }

}
