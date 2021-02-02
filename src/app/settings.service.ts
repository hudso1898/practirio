import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  pracSettings;
  constructor(private platform: Platform) {
    if(localStorage.getItem('pracSettings') !== null) {
      this.pracSettings = JSON.parse(localStorage.getItem('pracSettings'));
    }
    else {
      this.pracSettings = {
        darkMode: false
      }
      localStorage.setItem('pracSettings', JSON.stringify(this.pracSettings));
    }
    if(this.pracSettings.darkMode) {
      document.body.classList.toggle('dark', this.pracSettings.darkMode);
    }
   }

  toggleDarkMode() {
    this.pracSettings.darkMode = !this.pracSettings.darkMode;
    document.body.classList.toggle('dark', this.pracSettings.darkMode);
    localStorage.setItem('pracSettings', JSON.stringify(this.pracSettings));
  }

  isDarkMode() {
    return this.pracSettings.darkMode;
  }
  isMobile() {
    return (this.platform.width() < 768);
  }
  isWide() {
    return (this.platform.width() >= 1200);
  }
}
