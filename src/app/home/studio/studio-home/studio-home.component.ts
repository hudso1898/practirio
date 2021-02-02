import { Component, Input, OnInit } from '@angular/core';
import { Studio } from 'src/app/interfaces/Studio';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-studio-home',
  templateUrl: './studio-home.component.html',
  styleUrls: ['./studio-home.component.scss'],
})
export class StudioHomeComponent implements OnInit {

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {}

  get studio() {
    return (this.userDataService.isLoadingStudio) ? undefined : this.userDataService.studio;
  }

}
