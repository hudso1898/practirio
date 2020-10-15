import { Injectable } from '@angular/core';
import { User } from './interfaces/User';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Studio } from './interfaces/Studio';
import { Ensemble } from './interfaces/Ensemble';
import { Profile } from './interfaces/Profile';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedIn: boolean = false;
  private loggingIn: boolean = false;
  private loginFail: boolean = false;
  private tokenPresent: boolean = false;
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

  constructor(private http: HttpClient, private storage: Storage, private router: Router) {
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
   }

   getUserInfo(user: User) {
     return this.http.post(this.apiUrl + 'userInfo', {id: user.id, sessionId: user.currentSessionId});
   }

   addStudioToUser(studio: Studio) {
     this.userStudios.push(studio);
     this.userStudios.sort(this.sortByName);
     this.user.studios.push(studio.id);
     if (this.findProfile(studio)) {
       this.user.profiles.push(this.findProfile(studio));
     }
   }
   findProfile(obj: Studio | Ensemble): string {
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
    console.dir(this.user);
    this.hasFetchedUserInfo = true;
   }

   logout() {
     this.storage.remove('loggedIn');
     this.tokenPresent = false;
     this.loggedIn = false;
     this.router.navigate(["/"]);
   }
   searchUser(username: String) {
     return this.http.get(this.apiUrl + 'get/user/' + username);
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
