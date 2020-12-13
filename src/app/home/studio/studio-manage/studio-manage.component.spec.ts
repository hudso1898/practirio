import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudioManageComponent } from './studio-manage.component';

describe('StudioManageComponent', () => {
  let component: StudioManageComponent;
  let fixture: ComponentFixture<StudioManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudioManageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudioManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
