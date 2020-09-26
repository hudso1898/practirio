import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudiosComponent } from './studios.component';

describe('StudiosComponent', () => {
  let component: StudiosComponent;
  let fixture: ComponentFixture<StudiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
