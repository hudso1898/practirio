import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from '../interfaces/Profile';
import { Studio } from '../interfaces/Studio';
import { User } from '../interfaces/User';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  isLoadingStudios: boolean = false;
  apiUrl = 'https://www.practirio.com:9000/';
  studio: Studio;
  isLoadingStudio: boolean = false;
  loadError: boolean = false;

  loadedUsers: User[] = [];
  userIds = [];
  constructor(private http: HttpClient) { }
  
  searchStudio(name: string, tags: string[]) {
    return this.http.post(this.apiUrl + 'search/studio/' + name, {
      tags: (tags.length > 0) ? tags : undefined
    });
  }
  applyStudio(uid: string, studioId: string, sid: string) {
    return this.http.post(this.apiUrl + 'apply/studio', {
      uid: uid,
      studioId: studioId,
      sid: sid
    });
  }

  addUserToStudio(uid: string, sid: string, studioId: string, applicantId: string, type: string) {
    return this.http.post(this.apiUrl + 'studio/addMember', {
      uid: uid,
      sid: sid,
      studioId: studioId,
      applicantId: applicantId,
      type: type
    });
  }

  denyStudioApplication(uid: string, sid: string, studioId: string, applicantId: string) {
    return this.http.post(this.apiUrl + 'studio/denyApplication', {
      uid: uid,
      sid: sid,
      studioId: studioId,
      applicantId: applicantId
    });
  }

  addUser(user: User) {
    this.loadedUsers.push(user);
  }
  findUser(id: string) {
    return (this.loadedUsers.findIndex(user => user.id === id) !== -1) ? true : false;
  }

  getUser(id: string): User {
    if(this.loadedUsers.findIndex(user => user.id === id) !== -1) {
      return this.loadedUsers[this.loadedUsers.findIndex(user => user.id === id)]
    }
    else {
      return {id: "", firstname: "", lastname: "", username: ""}
    }
  }

  loadingUser(id: string) {
    return (this.userIds.includes(id))
  }
  searchAndAddUser(id: string) {
    console.log('adding ' + id)
    this.userIds.push(id);
    this.searchUser(id).subscribe((res: {found: boolean, firstname: string, id: string, lastname: string, username: string}) => {
      if (res.found) {
        this.addUser({
          id: res.id,
          firstname: res.firstname,
          lastname: res.lastname,
          username: res.username
        });
      }
      console.dir(res)
    });
  }
  searchUser(id: string) {
    return this.http.get(this.apiUrl + 'get/userById/' + id);
  }
  isInstructor(studio: Studio, user: User): boolean {
    return (studio.instructors.find(i => i.id === user.id)) ? true : false;
  }
  isAssistant(studio: Studio, user: User): boolean {
    return (studio.assistants.find(a => a.id === user.id)) ? true : false;
  }
  isStudent(studio: Studio, user: User): boolean {
    return (studio.students.find(s => s.id === user.id)) ? true : false;
  }
  getStudioProfile(studio: Studio, user: User): Profile | {} {
    if (this.isInstructor(studio, user)) {
      return studio.instructors.find(i => i.id === user.id).profile;
    }
    else if (this.isAssistant(studio,user)) {
      return studio.assistants.find(a => a.id === user.id).profile;
    }
    else if (this.isStudent(studio,user)) {
      return studio.students.find(s => s.id === user.id).profile;
    }
    else return {};
  }
}
