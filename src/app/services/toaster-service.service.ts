import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToasterServiceService {

  constructor(private toastCtrl: ToastController) { }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500
    });
    return await toast.present();
  }
}
