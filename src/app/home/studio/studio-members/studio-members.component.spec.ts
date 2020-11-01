import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudioMembersComponent } from './studio-members.component';

describe('StudioMembersComponent', () => {
  let component: StudioMembersComponent;
  let fixture: ComponentFixture<StudioMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudioMembersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudioMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
