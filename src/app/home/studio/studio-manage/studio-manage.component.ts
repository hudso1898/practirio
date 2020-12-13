import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-studio-manage',
  templateUrl: './studio-manage.component.html',
  styleUrls: ['./studio-manage.component.scss'],
})
export class StudioManageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userDataService: UserDataService) { }

  ngOnInit() {}

}
