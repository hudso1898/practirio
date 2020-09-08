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
    'Connected',
    'Educated',
    'Inspirational',
    'Better'
  ];
  currentAdj: string = this.adjectives[0];
  adj_i: number = 0;
  hasPitchAppeared: boolean = false;
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
    const pitchAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('.pitch'))
    .addElement(document.querySelector('#treble-image-light'))
    .addElement(document.querySelector('#treble-image-dark'))
    .addElement(document.querySelector('#eigth-image-light'))
    .addElement(document.querySelector('#eigth-image-dark'))
    .duration(1000)
    .iterations(1)
    .fromTo('opacity', 0, 1);

    const trebleFloatUpAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#treble-image-light'))
    .addElement(document.querySelector('#treble-image-dark'))
    .duration(3000)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(-125px)', 'translateY(-150px')
    .onFinish(() => {
      trebleFloatDownAnimation.stop();
      trebleFloatDownAnimation.play();
    });
    const trebleFloatDownAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#treble-image-light'))
    .addElement(document.querySelector('#treble-image-dark'))
    .duration(3000)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(-150px)', 'translateY(-125px')
    .onFinish(() => {
      trebleFloatUpAnimation.stop();
      trebleFloatUpAnimation.play();
    });

    const eigthFloatUpAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#eigth-image-light'))
    .addElement(document.querySelector('#eigth-image-dark'))
    .duration(4000)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(-125px)', 'translateY(-150px')
    .onFinish(() => {
      eigthFloatDownAnimation.stop();
      eigthFloatDownAnimation.play();
    });
    const eigthFloatDownAnimation = this.animationCtrl.create()
    .addElement(document.querySelector('#eigth-image-light'))
    .addElement(document.querySelector('#eigth-image-dark'))
    .duration(4000)
    .easing('ease-in-out')
    .iterations(1)
    .fromTo('transform', 'translateY(-150px)', 'translateY(-125px')
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
        }
      });
    }, {
      root: document.querySelector('#frontpage'),
      rootMargin: '0px',
      threshold: 1
    })
    imageObserver.observe(document.querySelector('#pitch-target'));
  }

}
