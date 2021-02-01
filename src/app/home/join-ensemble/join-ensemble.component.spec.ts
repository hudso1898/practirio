import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JoinEnsembleComponent } from './join-ensemble.component';

describe('JoinEnsembleComponent', () => {
  let component: JoinEnsembleComponent;
  let fixture: ComponentFixture<JoinEnsembleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinEnsembleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JoinEnsembleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
