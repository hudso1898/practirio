import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Studio } from 'src/app/interfaces/Studio';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SettingsService } from 'src/app/settings.service';

@Component({
  selector: 'app-join-studio',
  templateUrl: './join-studio.component.html',
  styleUrls: ['./join-studio.component.scss'],
})
export class JoinStudioComponent implements OnInit {

  studioForm: FormGroup;
  tags: string[] = [];
  isSearching: boolean = false;
  results: Studio[] = [];
  isJoining: boolean;
  oldSearchTerm: string = "";
  shouldRefresh: boolean = false;
  oldTags: string[] = [];
  
  constructor(private formBuilder: FormBuilder, private userDataService: UserDataService, private loginService: LoginService, private settingsService: SettingsService) {
    this.studioForm = formBuilder.group({
      name: [''],
      description: [''],
      tag: ['']
    });
  }

  ngOnInit() {
    this.userDataService.headerMessage = '';
  }
  addTag(tag) {
    if (this.tags.includes(tag)) return;
    this.tags.push(tag);
    this.studioForm.get("tag").setValue("");
    this.shouldRefresh = true;
    this.search();
  }
  removeTag(tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
    this.shouldRefresh = true;
    this.search();
  }
  addTagKeyup(event) {
    if (event.keyCode === 13) this.addTag(this.studioForm.value["tag"]);
  }
  nameKeyup(event) {
    if (event.keyCode === 13) this.search();
  }
  buttonSearch() {
    this.shouldRefresh = true;
    this.search();
  }
  search() {
    if(this.shouldRefresh || (this.results !== [] && (this.studioForm.value["name"] !== this.oldSearchTerm || this.tags !== this.oldTags))) {
    this.results = [];
    this.shouldRefresh = false;
    if(this.studioForm.value["name"].length === 0 && this.tags.length === 0) return;
    this.isSearching = true;
    this.userDataService.searchStudio(this.studioForm.value["name"], this.tags).subscribe((res: Studio[]) => {
      this.results = res;
      this.oldSearchTerm = this.studioForm.value["name"];
      this.oldTags = this.tags;
      this.isSearching = false;
    }, err => {
      console.dir(err);
      this.isSearching = false;
    });
    }
  }
  requestJoin(studio: Studio) {
    this.isJoining = true;
    this.userDataService.applyStudio(this.loginService.user.id, studio.id, this.loginService.user.currentSessionId).subscribe((res: {ok: boolean, error: string}) => {
      this.shouldRefresh = true;
      this.search();
      this.isJoining = false;
    })
  }
  isSearched(tag: string): string {
    return (this.tags.includes(tag)) ? 'primary' : 'medium';
  }

}
