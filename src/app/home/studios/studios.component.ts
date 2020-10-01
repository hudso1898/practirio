import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-studios',
  templateUrl: './studios.component.html',
  styleUrls: ['./studios.component.scss'],
})
export class StudiosComponent implements OnInit {

  constructor(private platform: Platform) { }

  ngOnInit() {}

  isMobile() {
    return (this.platform.width() < 768);
  }
}
