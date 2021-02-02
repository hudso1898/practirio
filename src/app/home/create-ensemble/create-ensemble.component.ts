import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-create-ensemble',
  templateUrl: './create-ensemble.component.html',
  styleUrls: ['./create-ensemble.component.scss'],
})
export class CreateEnsembleComponent implements OnInit {

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    this.userDataService.headerMessage = '';
  }

}
