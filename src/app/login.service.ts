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
  usernames: Array<String> = [];

  apiUrl = 'https://www.practirio.com:9000/';

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.get('loggedIn').then((user) => {
      if (user) {
        this.loggedIn = true;
        this.user = user;
      }
      else this.loggedIn = false;
    });
    this.http.get(this.apiUrl + 'get/users').subscribe((users: Array<String>) => {
      for (let user of users) {
        this.usernames.push(user)
      }
      console.dir(this.usernames)
    });
   }

   login(username, password) {
     this.loggingIn = true;
     this.loginFail = false;
     return this.http.post(this.apiUrl + 'users/login', {username: username, password: password});
   }
   setLoggedIn(result: User) {
    this.loggedIn = true;
    this.user = {
      id: result.id,
      username: result.username,
      password: null,
      email: result.email,
      firstname: result.firstname,
      lastname: result.lastname,
      fullname: result.fullname
    };

    this.storage.set('loggedIn', this.user);
   }

   logout() {
     this.storage.remove('loggedIn');
     this.loggedIn = false;
   }
   searchUser(username: String): boolean {
     for (let user of this.usernames) {
       if(username == user) return true;
     }
     return false;
   }

   addUser(user: User) {
     this.usernames.push(user.username);
     this.http.post(this.apiUrl + 'users/addUser', user).subscribe();
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
