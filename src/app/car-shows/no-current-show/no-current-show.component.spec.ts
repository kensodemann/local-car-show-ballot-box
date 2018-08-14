import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController } from '@ionic/angular';

import { NoCurrentShowComponent } from './no-current-show.component';
import { createNavControllerMock } from '../../../../test/mocks';

describe('NoCurrentShowComponent', () => {
  let component: NoCurrentShowComponent;
  let fixture: ComponentFixture<NoCurrentShowComponent>;
  let navCtrl;

  beforeEach(async(() => {
    navCtrl = createNavControllerMock();
    TestBed.configureTestingModule({
      declarations: [NoCurrentShowComponent],
      providers: [{ provide: NavController, useValue: navCtrl }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCurrentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clicking "Create Show"', () => {
    it('navigates to the car show setup page', () => {
      component.createShowClicked();
      expect(navCtrl.goForward).toHaveBeenCalledTimes(1);
      expect(navCtrl.goForward).toHaveBeenCalledWith('create-new-show');
    });
  });
});
