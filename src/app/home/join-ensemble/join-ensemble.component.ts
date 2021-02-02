import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-join-ensemble',
  templateUrl: './join-ensemble.component.html',
  styleUrls: ['./join-ensemble.component.scss'],
})
export class JoinEnsembleComponent implements OnInit {

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    this.userDataService.headerMessage = '';
  }

}
