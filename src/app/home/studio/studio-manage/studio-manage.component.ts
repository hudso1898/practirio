import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserDataService } from 'src/app/services/user-data.service';
import { DeleteStudioConfirmComponent } from './delete-studio-confirm/delete-studio-confirm.component';

@Component({
  selector: 'app-studio-manage',
  templateUrl: './studio-manage.component.html',
  styleUrls: ['./studio-manage.component.scss'],
})
export class StudioManageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userDataService: UserDataService, private modalCtrl: ModalController) { }

  ngOnInit() {}

  async confirmDelete() {
    const popover = await this.modalCtrl.create({
      component: DeleteStudioConfirmComponent,
      componentProps: {studio: this.userDataService.studio},
      cssClass: 'delete-popover'
    });
    await popover.present();
  }
}
