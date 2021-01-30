import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Studio } from 'src/app/interfaces/Studio';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.page.html',
  styleUrls: ['./studio.page.scss'],
})
export class StudioPage implements OnInit {

  studio: Studio;
  
  get studioName(): string {
    return (this.studio) ? this.studio.name : "";
  }
  constructor(private loginService: LoginService, private route: ActivatedRoute, private settingsService: SettingsService, private userDataService: UserDataService,
    private router: Router) { }

  ngOnInit() {
    this.userDataService.triggerUpdateStudio.subscribe(e => this.init());
    this.init();
  }
  ngAfterViewChecked() {
    if (this.userDataService.studio && this.userDataService.studio.id !== this.route.snapshot.params['id']) this.init();
  }
  public init() {
    this.userDataService.loadError = false;
    this.userDataService.isLoadingStudio = true;
    this.loginService.searchStudioById(this.route.snapshot.params['id']).subscribe((res: {found: boolean, studio: Studio}) => {
      if (res.found && (res.studio.instructors.findIndex(i => i.id === this.loginService.user.id) !== -1
      || res.studio.assistants.findIndex(a => a.id === this.loginService.user.id) !== -1
      || res.studio.students.findIndex(s => s.id === this.loginService.user.id) !== -1)) {
        this.studio = res.studio;
        this.userDataService.studio = this.studio;
        this.userDataService.updateStudio.emit('update');
        this.loginService.updateStudioUsers(this.studio);
      }
      else this.userDataService.loadError = true;
      this.userDataService.isLoadingStudio = false;
      if (this.router.url.includes('manage') && !this.isInstructor()) this.router.navigateByUrl('/home/studios/' + this.route.snapshot.params['id'])
    });
  }

  get studioId(): string {
    return this.route.snapshot.params['id'];
  }

  isInstructor(): boolean {
    return this.studio.instructors.findIndex(i => i.id === this.loginService.user.id) !== -1
  }
  onActivate(event) {
    if (event.update) {
      event.update.subscribe(ev => {
        console.log('init')
        if (ev === 'init') this.init();
      });
      console.log('update')
    }
    else console.log('no update')
  }

}
