import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit {

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    this.userDataService.headerMessage = '';
  }

}
