import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Studio } from 'src/app/interfaces/Studio';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-delete-studio-confirm',
  templateUrl: './delete-studio-confirm.component.html',
  styleUrls: ['./delete-studio-confirm.component.scss'],
})
export class DeleteStudioConfirmComponent implements OnInit {

  @Input("studio")
  studio: Studio;
  confirm: string = '';
  isDeleting: boolean = false;
  constructor(private userDataService: UserDataService, private loginService: LoginService, private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {}
  
  confirmDelete() {
    this.isDeleting = true;
    this.userDataService.deleteStudio(this.loginService.user.id, this.loginService.user.currentSessionId, this.studio.id).subscribe((res: {ok: boolean}) => {
      this.isDeleting = false;
      if (res.ok) {
        this.loginService.userStudios.splice(this.loginService.userStudios.findIndex(studio => studio.id === this.studio.id), 1);
        this.router.navigateByUrl('/home/studios');
        this.modalCtrl.dismiss();
      }
    })
  }

}
