import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginDialogPage } from './login-dialog.page';

describe('LoginDialogPage', () => {
  let component: LoginDialogPage;
  let fixture: ComponentFixture<LoginDialogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDialogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
