import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  isLoadingStudios: boolean = false;
  constructor() { }
}
