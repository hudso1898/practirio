import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {

  constructor(private platform: Platform, private loginService: LoginService) { }

  ngOnInit() {
    console.dir(this.loginService.userStudios)
  }
  isMobile() {
    return (this.platform.width() < 768);
  }

}
