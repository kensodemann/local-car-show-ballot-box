import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

import { BallotsPage } from './ballots.page';
import { createNavControllerMock } from '../../../test/mocks';

describe('BallotsPage', () => {
  let component: BallotsPage;
  let fixture: ComponentFixture<BallotsPage>;
  let navController;

  beforeEach(async () => {
    navController = createNavControllerMock();
    TestBed.configureTestingModule({
      declarations: [BallotsPage],
      providers: [{ provide: NavController, useValue: navController }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exists', () => {
    expect(component).toBeTruthy();
  });

  describe('add button', () => {
    it('navigates to the editor', () => {
      component.addBallot();
      expect(navController.navigateForward).toHaveBeenCalledTimes(1);
      expect(navController.navigateForward).toHaveBeenCalledWith('ballot-editor');
    });
  });
});
