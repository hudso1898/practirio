import { Injectable } from '@angular/core';
import { User } from './interfaces/User';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Studio } from './interfaces/Studio';
import { Ensemble } from './interfaces/Ensemble';
import { Profile } from './interfaces/Profile';
import { UserDataService } from './services/user-data.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedIn: boolean = false;
  private loggingIn: boolean = false;
  private loginFail: boolean = false;
  private tokenPresent: boolean = false;
  private loadedStudios: number = 0;
  user: User;

  public isFetchingUserInfo: boolean = false;
  public hasFetchedUserInfo: boolean = false;
  userStudios: Studio[] = [];
  userEnsembles: Ensemble[] = [];
  userProfiles: Profile[] = [];

  apiUrl = 'https://www.practirio.com:9000/';

  sortByName(obj1: { name: string}, obj2: { name: string }) : number {
    return (obj1.name < obj2.name) ? -1 :
      (obj1.name === obj2.name) ? 0 : 1;
  }

  constructor(private http: HttpClient, private storage: Storage, private router: Router, private userDataService: UserDataService) {
    this.storage.get('loggedIn').then((user) => {
      this.loggingIn = true;
      if (user && user.id !== undefined && user.currentSessionId !== undefined) {
        this.tokenPresent = true;
        this.verifySession(user).subscribe((res: { ok: boolean, expired: boolean }) => {
          if (res.ok) {
            this.loggedIn = true;
            this.user = user;
          }
          else {
            this.storage.remove('loggedIn');
            this.tokenPresent = false;
            this.loggedIn = false;
            if (res.expired) {
              this.router.navigate(['/sessionExpired']);
            }
            else {
              this.router.navigate(['/']);
            }
          }
          this.loggingIn = false;
        });
      }
      else {
        this.loggingIn = false;
        this.loggedIn = false;
      }
    });
   }

   login(username, password, staySignedIn) {
     this.loggingIn = true;
     this.loginFail = false;
     return this.http.post(this.apiUrl + 'users/login', {username: username, password: password, staySignedIn: staySignedIn});
   }
   verifySession(user: User) {
     return this.http.post(this.apiUrl + 'verifySession', {id: user.id, sessionId: user.currentSessionId});
   }
   setLoggedIn(result: User) {
    this.loggedIn = true;
    this.user = {
      id: result.id,
      username: result.username,
      password: undefined,
      email: result.email,
      firstname: result.firstname,
      lastname: result.lastname,
      currentSessionId: result.sessionId,
      expDate: result.expDate
    };

    this.storage.set('loggedIn', this.user);
    this.tokenPresent = true;
    this.loggingIn = false;
    if (this.user) {
      this.isFetchingUserInfo = true;
          this.getUserInfo(this.user).subscribe((res: { studios: string[], ensembles: Ensemble[], profiles: Profile[]}) => {
            if (res) {
              this.setUserInfo([], [], []);
              if (res.studios.length > 0) {
                this.userDataService.isLoadingStudios = true;
                res.studios.map((studio) => {
                  this.searchStudioById(studio).subscribe((result: { found: boolean, studio: Studio}) => {
                    if (result.found) this.addStudioToUser(result.studio);
                    this.loadedStudios++;
                    if(this.loadedStudios >= res.studios.length) this.userDataService.isLoadingStudios = false;
                  })
                })
              }
              this.hasFetchedUserInfo = true;
              this.isFetchingUserInfo = false;
            }
          });
    }
    else {
      setInterval(() => {
        if (!this.hasFetchedUserInfo && !this.isFetchingUserInfo && this.user) {
          this.isFetchingUserInfo = true;
          this.getUserInfo(this.user).subscribe((res: { studios: string[], ensembles: Ensemble[], profiles: Profile[]}) => {
            if (res) {
              this.setUserInfo([], [], []);
              if (res.studios.length > 0) {
                this.userDataService.isLoadingStudios = true;
                res.studios.map((studio) => {
                  this.searchStudioById(studio).subscribe((result: { found: boolean, studio: Studio}) => {
                    if (result.found) this.addStudioToUser(result.studio);
                    this.loadedStudios++;
                    if(this.loadedStudios == res.studios.length) this.userDataService.isLoadingStudios = false;
                  })
                })
              }
              // this.loginService.setUserInfo(res.studios, res.ensembles, res.profiles);
              this.hasFetchedUserInfo = true;
              this.isFetchingUserInfo = false;
            }
          });
        }
      }, 2000);
    }
   }

   getUserInfo(user: User) {
     return this.http.post(this.apiUrl + 'userInfo', {id: user.id, sessionId: user.currentSessionId});
   }

   addStudioToUser(studio: Studio) {
     this.userStudios.push(studio);
     this.userStudios.sort(this.sortByName);
     this.user.studios.push(studio.id);
     if (this.findProfile(studio)) {
       this.user.profiles.push(this.findProfile(studio).id);
     }
     let userIds = [];
     for (let instructor of studio.instructors) {
      if (!this.userDataService.loadingUser(instructor.id) && !userIds.includes(instructor.id)) {
        userIds.push(instructor.id);
      }
    }
    for (let assistant of studio.assistants) {
      if (!this.userDataService.loadingUser(assistant.id) && !userIds.includes(assistant.id)) {
        userIds.push(assistant.id);
      }
    }
    for (let student of studio.students) {
      if (!this.userDataService.loadingUser(student.id) && !userIds.includes(student.id)) {
        userIds.push(student.id);
      }
    }
    if (studio.instructors.findIndex(i => i.id === this.user.id) !== -1 && studio.applicants) {
      for (let applicant of studio.applicants) {
        userIds.push(applicant);
      }
    }
    for (let id of userIds) {
      if (!this.userDataService.loadingUser(id)) this.userDataService.searchAndAddUser(id);
    }
   }

   updateStudioUsers(studio: Studio) {
    let userIds = [];
    for (let instructor of studio.instructors) {
     if (!this.userDataService.loadingUser(instructor.id) && !userIds.includes(instructor.id)) {
       userIds.push(instructor.id);
     }
   }
   for (let assistant of studio.assistants) {
     if (!this.userDataService.loadingUser(assistant.id) && !userIds.includes(assistant.id)) {
       userIds.push(assistant.id);
     }
   }
   for (let student of studio.students) {
     if (!this.userDataService.loadingUser(student.id) && !userIds.includes(student.id)) {
       userIds.push(student.id);
     }
   }
   if (studio.instructors.findIndex(i => i.id === this.user.id) !== -1 && studio.applicants) {
     for (let applicant of studio.applicants) {
       userIds.push(applicant);
     }
   }
   for (let id of userIds) {
     if (!this.userDataService.loadingUser(id)) this.userDataService.searchAndAddUser(id);
   }
   }
   findProfile(obj: Studio | Ensemble): Profile {
     if (obj.instructors.find(val => val.id === this.user.id)) return obj.instructors.find(val => val.id === this.user.id).profile;
     else if (obj.assistants.find(val => val.id === this.user.id)) return obj.assistants.find(val => val.id === this.user.id).profile;
     else if (obj.students.find(val => val.id === this.user.id)) return obj.students.find(val => val.id === this.user.id).profile;
     else return null;
   }
   resetUserInfo() {
     this.userStudios = [];
     this.userEnsembles = [];
     this.userProfiles = [];
   }
   setUserInfo(studios: Studio[], ensembles: Ensemble[], profiles: Profile[]) {
    this.userStudios = studios;
    this.userEnsembles = ensembles;
    this.userProfiles = profiles;

    this.user.studios = [];
    this.user.ensembles = [];
    this.user.profiles = [];


    for (let studio of studios) {
      this.user.studios.push(studio.id);
    }
    for (let ensemble of ensembles) {
      this.user.ensembles.push(ensemble.id);
    }
    for (let profile of profiles) {
      this.user.profiles.push(profile.id);
    }
    this.hasFetchedUserInfo = true;
   }

   logout() {
     this.storage.remove('loggedIn');
     this.tokenPresent = false;
     this.loggedIn = false;
     this.userStudios = [];
     this.userEnsembles = [];
     this.userProfiles = [];
     this.userDataService.studio = undefined;
     this.router.navigateByUrl('/');
   }
   searchUser(username: String) {
     return this.http.get(this.apiUrl + 'get/user/' + username);
   }
   searchUserByNames(names: string[]) {
     return this.http.post(this.apiUrl + 'searchUser', {names: names});
   }
   searchStudioById(id: string) {
     return this.http.get(this.apiUrl + 'get/studioById/' + id);
   }
   searchStudio(name: string) {
     return this.http.get(this.apiUrl + 'get/studio/' + name);
   }
   addStudio(name: string, desc: string, tags: string[]) {
     return this.http.post(this.apiUrl + 'addStudio', {
      userId: this.user.id,
      sessionId: this.user.currentSessionId,
      name: name,
      description: desc,
      tags: tags
     });
   }

   addUser(user: User) {
     return this.http.post(this.apiUrl + 'users/addUser', user);
   }

   isLoggedIn(): boolean {
     return this.loggedIn;
   }
   isLoggingIn(): boolean {
     return this.loggingIn;
   }
   failedLogin() {
     this.loggingIn = false;
     this.loginFail = true;
   }
   didLoginFail(): boolean {
     return this.loginFail;
   }
   verifyAccount(verifyId: string) {
     return this.http.post(this.apiUrl + 'verifyUser', { verifyId: verifyId});
   }
   isTokenPresent(): boolean {
     return this.tokenPresent;
   }
}
