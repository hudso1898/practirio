import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Lesson } from '../interfaces/Lesson';
import { Profile } from '../interfaces/Profile';
import { Studio } from '../interfaces/Studio';
import { User } from '../interfaces/User';
import { Storage} from '@ionic/storage';
import { ToasterServiceService } from './toaster-service.service';
import { Todo } from '../interfaces/Todo';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  isLoadingStudios: boolean = false;
  apiUrl = 'https://www.practirio.com:9000/';
  studio: Studio;
  isLoadingStudio: boolean = false;
  loadError: boolean = false;
  updateStudio: EventEmitter<any> = new EventEmitter();
  triggerUpdateStudio: EventEmitter<any> = new EventEmitter();

  loadedUsers: User[] = [];
  userIds = [];
  idSize = 32;
  chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // characters to use to generate the id
  constructor(private http: HttpClient, private toasterService: ToasterServiceService, private storage: Storage) { }
  
  generateID() {
    let id = '';
    // 1/4: seeded on time plus a random number multiplier (0 to 1)
    for (let i = 0; i < this.idSize / 4; i++) {
      id += this.chars.charAt((Date.now() * Math.random() % this.chars.length));
    }
    // 3/4: seeded only on random number
    for(let i = this.idSize / 4; i < this.idSize; i++) {
      id += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
    }
    return id;
  }
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

  deleteStudio(uid: string, sid: string, studioId: string) {
    return this.http.post(this.apiUrl + 'studio/delete', {
      uid: uid,
      sid: sid,
      studioId: studioId
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
  getStudioProfile(studio: Studio, user: User): Profile {
    if (this.isInstructor(studio, user)) {
      return studio.instructors.find(i => i.id === user.id).profile;
    }
    else if (this.isAssistant(studio,user)) {
      return studio.assistants.find(a => a.id === user.id).profile;
    }
    else if (this.isStudent(studio,user)) {
      return studio.students.find(s => s.id === user.id).profile;
    }
    else return {id: "", lessons: [], userId: "", todos: []};
  }
  changeStudioRole(uid: string, sid: string, studioId: string, newuid: string, newRole: string ) {
    return this.http.post(this.apiUrl + 'studio/changeRole', {
      uid: uid,
      sid: sid,
      studioId: studioId,
      newuid: newuid,
      newRole: newRole
    });
  }
  removeUserFromStudio(uid: string, sid: string, studioId: string, removeId: string) {
    return this.http.post(this.apiUrl + 'studio/removeMember', {
      uid: uid,
      sid: sid,
      studioId: studioId,
      removeId: removeId
    });
  }
  /**
   * Save the given lesson notes to LocalStorage
   * @param lesson The lesson data
   * @param uid The user who this lesson is for
   * @param studioId The studio for this lesson
   * @param id The id of the lesson
   */
  async localSaveLessonNotes(lesson: Lesson, uid: string, studioId: string, id: string) {
    await this.storage.set('studio-' + studioId + '-lesson' + id + '-' + uid, lesson);
    await this.toasterService.toast('Notes for this lesson saved on this device!');
  }
  async localRemoveLessonNotes(uid: string, studioId: string, id: string) {
    await this.storage.remove('studio-' + studioId + '-lesson' + id + '-' + uid);
  }
  async localGetLessonNotes(uid: string, studioId: string, id: string): Promise<Lesson | undefined> {
    return (await this.storage.get('studio-' + studioId + '-lesson' + id + '-' + uid)) ? await this.storage.get('studio-' + studioId + '-lesson' + id + '-' + uid) : undefined;
  }
  submitLesson(uid: string, sid: string, studioId: string, lesson: Lesson, todos: Todo[], lessonUser: string) {
    return this.http.post(this.apiUrl + 'studio/addLesson', {
      uid: uid,
      sid: sid,
      studioId: studioId,
      lesson: lesson,
      todos: todos,
      lessonUser: lessonUser
    });
  }
}
