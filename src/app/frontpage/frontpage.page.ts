import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../login.service';
import { SettingsService } from '../settings.service';
import { Animation, AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';

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
    'Connected',
    'Educated',
    'Inspirational',
    'Better'
  ];
  currentAdj: string = this.adjectives[0];
  cacheIsMobile: boolean;
  adj_i: number = 0;
  hasPitchAppeared: boolean = false;
  fadeAnimation: Animation
  constructor(private loginService: LoginService,
    private settingsService: SettingsService,
    private animationCtrl: AnimationController,
    private router: Router,
    private userDataService: UserDataService) {
      if(loginService.isTokenPresent()) {
        this.router.navigate(['/home']);
      }
    }

  ngOnInit() {
    this.userDataService.headerMessage = '';
    setTimeout(() => {
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
    const pitchAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('.pitch'))
    .duration(1000)
    .iterations(1)
    .fromTo('opacity', 0, 1);
    const pitch1ImageAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#treble-image-light'))
    .addElement(document.querySelector('#treble-image-dark'))
    .addElement(document.querySelector('#eigth-image-light'))
    .addElement(document.querySelector('#eigth-image-dark'))
    .duration(1500)
    .iterations(1)
    .fromTo('opacity', 0, 1);

    const trebleFloatUpAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#treble-image-light'))
    .addElement(document.querySelector('#treble-image-dark'))
    .duration(3500)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(0vh)', 'translateY(-20vh)')
    .onFinish(() => {
      trebleFloatDownAnimation.stop();
      trebleFloatDownAnimation.play();
    });
    const trebleFloatDownAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#treble-image-light'))
    .addElement(document.querySelector('#treble-image-dark'))
    .duration(3500)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(-20vh)', 'translateY(0vh)')
    .onFinish(() => {
      trebleFloatUpAnimation.stop();
      trebleFloatUpAnimation.play();
    });

    const eigthFloatUpAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#eigth-image-light'))
    .addElement(document.querySelector('#eigth-image-dark'))
    .duration(4243)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(0vh)', 'translateY(-20vh)')
    .onFinish(() => {
      eigthFloatDownAnimation.stop();
      eigthFloatDownAnimation.play();
    });
    const eigthFloatDownAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#eigth-image-light'))
    .addElement(document.querySelector('#eigth-image-dark'))
    .duration(4243)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(-20vh)', 'translateY(0vh)')
    .onFinish(() => {
      eigthFloatUpAnimation.stop();
      eigthFloatUpAnimation.play();
    });

    trebleFloatUpAnimation.play();
    eigthFloatDownAnimation.play();

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
    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasPitchAppeared) {
          this.hasPitchAppeared = true;
          pitchAnimation.play();
          pitch1ImageAnimation.delay(200).play();
        }
      });
    }, {
      root: document.querySelector('#frontpage'),
      rootMargin: '0px',
      threshold: 0.5
    })
    imageObserver.observe(document.querySelector('#pitch-target'));
    setInterval(() => {
      if (this.loginService.isLoggedIn() && !this.router.url.includes('/home')) this.router.navigate(['/home']);
    }, 1000);
    this.cacheIsMobile = this.settingsService.isMobile();
  }, 500);
  }
  get isMobile(): boolean {
    let res = this.settingsService.isMobile();
    if (res !== this.cacheIsMobile) {
      setTimeout(() => {
        this.setupNoteAnimations();
      }, 500);
      this.cacheIsMobile = res;
    }
    return res;
  }

  setupNoteAnimations() {
    const trebleFloatUpAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#treble-image-light'))
    .addElement(document.querySelector('#treble-image-dark'))
    .duration(3500)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(0vh)', 'translateY(-20vh)')
    .onFinish(() => {
      trebleFloatDownAnimation.stop();
      trebleFloatDownAnimation.play();
    });
    const trebleFloatDownAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#treble-image-light'))
    .addElement(document.querySelector('#treble-image-dark'))
    .duration(3500)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(-20vh)', 'translateY(0vh')
    .onFinish(() => {
      trebleFloatUpAnimation.stop();
      trebleFloatUpAnimation.play();
    });

    const eigthFloatUpAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#eigth-image-light'))
    .addElement(document.querySelector('#eigth-image-dark'))
    .duration(4243)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(0vh)', 'translateY(-20vh')
    .onFinish(() => {
      eigthFloatDownAnimation.stop();
      eigthFloatDownAnimation.play();
    });
    const eigthFloatDownAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#eigth-image-light'))
    .addElement(document.querySelector('#eigth-image-dark'))
    .duration(4243)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(-20vh)', 'translateY(0vh')
    .onFinish(() => {
      eigthFloatUpAnimation.stop();
      eigthFloatUpAnimation.play();
    });

    trebleFloatUpAnimation.play();
    eigthFloatDownAnimation.play();
  }

}
