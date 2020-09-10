import { Injectable } from '@angular/core';
import { User } from './interfaces/User';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedIn: boolean = false;
  private loggingIn: boolean = false;
  private loginFail: boolean = false;
  user: User;

  apiUrl = 'https://www.practirio.com:9000/';

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.get('loggedIn').then((user) => {
      if (user) {
        this.loggedIn = true;
        this.user = user;
      }
      else this.loggedIn = false;
    });
   }

   login(username, password, staySignedIn) {
     this.loggingIn = true;
     this.loginFail = false;
     return this.http.post(this.apiUrl + 'users/login', {username: username, password: password, staySignedIn: staySignedIn});
   }
   setLoggedIn(result: User) {
    this.loggedIn = true;
    this.user = {
      id: result.id,
      username: result.username,
      password: null,
      email: result.email,
      firstname: result.firstname,
      lastname: result.lastname
    };

    this.storage.set('loggedIn', this.user);
   }

   logout() {
     this.storage.remove('loggedIn');
     this.loggedIn = false;
   }
   searchUser(username: String) {
     return this.http.get(this.apiUrl + 'get/user/' + username);
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
}
