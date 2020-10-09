import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JoinStudioComponent } from './join-studio.component';

describe('JoinStudioComponent', () => {
  let component: JoinStudioComponent;
  let fixture: ComponentFixture<JoinStudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinStudioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JoinStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
