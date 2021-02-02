import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    this.userDataService.headerMessage = '';
  }

}
