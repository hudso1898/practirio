import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-ensembles',
  templateUrl: './ensembles.component.html',
  styleUrls: ['./ensembles.component.scss'],
})
export class EnsemblesComponent implements OnInit {

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    this.userDataService.headerMessage = '';
  }

}
