import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../login.service';
import { SettingsService } from '../settings.service';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.page.html',
  styleUrls: ['./frontpage.page.scss'],
})
export class FrontpagePage implements OnInit {

  adjectives: string[] = [
    'Smarter',
    'Informed',
    'Improve',
    'Passionate',
    'Dedicated',
    'Inspirational',
    'Better'
  ];
  currentAdj: string = this.adjectives[0];
  adj_i: number = 0;
  fadeAnimation: Animation
  constructor(private loginService: LoginService,
    private settingsService: SettingsService,
    private animationCtrl: AnimationController) {
    }

  ngOnInit() {
    this.fadeAnimation = this.animationCtrl.create()
      .addElement(document.querySelector('#adj'))
      .duration(2000)
      .iterations(1)
      .keyframes([
        { offset: 0, opacity: 1 },
        { offset: 0.5, opacity: 0 },
        { offset: 1, opacity: 1 }
      ]);  
    const appearAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#prac-logo-light'))
    .addElement(document.querySelector('#prac-logo-dark'))
    .addElement(document.querySelector('.title'))
    .duration(1500)
    .iterations(1)
    .fromTo('opacity', 0, 1);
    appearAnimation.play();
    setInterval(() => {
      this.fadeAnimation.play();
      setTimeout(() => {
        if (this.adj_i < this.adjectives.length - 1) {
          this.adj_i++;
        }
        else {
          this.adj_i = 0;
        }
        this.currentAdj = this.adjectives[this.adj_i];
      }, 1000)
    }, 5000);
  }

  login() {
    this.loginService.loggedIn = !this.loginService.loggedIn;
  }
  theme() {
    this.settingsService.toggleDarkMode();
  }

}
