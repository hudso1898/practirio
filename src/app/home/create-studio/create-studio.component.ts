import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-create-studio',
  templateUrl: './create-studio.component.html',
  styleUrls: ['./create-studio.component.scss'],
})
export class CreateStudioComponent implements OnInit {

  studioForm: FormGroup;
  tags: string[] = [];

  private file: File | null = null;

  isVerifyingStudio: boolean = false;
  isAddingStudio: boolean = false;
  isStudioTaken: boolean = false;
  studioVerified: boolean = false;

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.file = file;
  }
  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router, private userDataService: UserDataService) { 
    this.studioForm = formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      tag: ['']
    });
  }

  submit() {
    if (!this.studioForm.valid) return;
    this.isAddingStudio = true;
    this.loginService.addStudio(this.studioForm.value["name"], this.studioForm.value["description"], this.tags).subscribe((res: {success: boolean}) => {
      this.isAddingStudio = false;
      if (res.success) {
        this.loginService.hasFetchedUserInfo = false;
        this.router.navigate(["/home"]);
      }
    }, err => {
      this.isAddingStudio = false;
    });
    console.dir(this.file);
  }
  getLabelColor(formControlName: string) : string {
    return (this.studioForm.get(formControlName) !== undefined && (this.studioForm.get(formControlName).touched || this.studioForm.get(formControlName).dirty) && !this.studioForm.get(formControlName).valid) ? "danger" : "medium";
  }
  addTag(tag) {
    if (this.tags.includes(tag)) return;
    this.tags.push(tag);
    this.studioForm.get("tag").setValue("");
  }
  removeTag(tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
  }
  addTagKeyup(event) {
    if (event.keyCode === 13) this.addTag(this.studioForm.value["tag"]);
  }
  checkStudio() {
    if (this.isVerifyingStudio) return;
    this.isVerifyingStudio = true;
    this.isStudioTaken = false;
    this.studioVerified = false;
    if (this.studioForm.value['name'] === '') {
      this.isVerifyingStudio = false;
    }
    else {

    this.loginService.searchStudio(this.studioForm.value['name']).subscribe((res: {found: boolean}) => {
      setTimeout(() => {
          if (res.found) {
            this.isStudioTaken = true;
          }
          else {
            this.studioVerified = true;
          }
          this.isVerifyingStudio = false;
      }, 750);
    })
  }
  }
  ngOnInit() {
    this.userDataService.headerMessage = '';
  }

}
