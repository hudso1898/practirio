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
     this.router.navigate(["/"]);
   }
   searchUser(username: String) {
     return this.http.get(this.apiUrl + 'get/user/' + username);
   }
   searchStudio(name: string) {
     return this.http.get(this.apiUrl + 'get/studio/' + name);
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
