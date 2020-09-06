import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrontpagePage } from './frontpage.page';

describe('FrontpagePage', () => {
  let component: FrontpagePage;
  let fixture: ComponentFixture<FrontpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrontpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
