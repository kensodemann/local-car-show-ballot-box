import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

import { BallotEditorPage } from './ballot-editor.page';
import {
  CarClassesService,
  createCarClassesServiceMock,
  testCarShowClasses,
  testCarClasses
} from '../services/car-classes';
import {
  createCarShowsServiceMock,
  CarShowsService,
  testCarShows
} from '../services/car-shows';
import { createBallotsServiceMock, BallotsService } from '../services/ballots';
import { createVotesServiceMock, VotesService } from '../services/votes';
import { createNavControllerMock } from '../../../test/mocks';
import { deepCopy } from '../../../test/util';

describe('BallotEditorPage', () => {
  let component: BallotEditorPage;
  let fixture: ComponentFixture<BallotEditorPage>;
  let ballotsService;
  let carClassesService;
  let carShowsService;
  let carShowThreeClasses;
  let navController;
  let votesService;

  beforeEach(async(() => {
    ballotsService = createBallotsServiceMock();
    carClassesService = createCarClassesServiceMock();
    carShowsService = createCarShowsServiceMock();
    navController = createNavControllerMock();
    votesService = createVotesServiceMock();
    carShowThreeClasses = deepCopy(
      testCarShowClasses.filter(c => c.carShowRid === 3)
    );
    carShowThreeClasses[4].active = false;
    carShowThreeClasses[8].active = false;
    TestBed.configureTestingModule({
      declarations: [BallotEditorPage],
      providers: [
        { provide: BallotsService, useValue: ballotsService },
        { provide: CarClassesService, useValue: carClassesService },
        { provide: CarShowsService, useValue: carShowsService },
        { provide: NavController, useValue: navController },
        { provide: VotesService, useValue: votesService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    carShowsService.current = testCarShows.find(c => c.id === 3);
    carClassesService.getAll.and.returnValue(testCarClasses);
    carClassesService.getAll
      .withArgs(3)
      .and.returnValue(Promise.resolve(carShowThreeClasses));

    fixture = TestBed.createComponent(BallotEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('gets classes for the current show', () => {
      expect(carClassesService.getAll).toHaveBeenCalledTimes(1);
      expect(carClassesService.getAll).toHaveBeenCalledWith(3);
      expect(component.classes).toEqual(
        carShowThreeClasses.filter(c => c.active)
      );
    });

    it('sets up the ballot', () => {
      expect(component.ballot).toEqual({ carShowRid: 3 });
    });
  });

  describe('save', () => {
    beforeEach(() => {
      ballotsService.save.and.returnValue(
        Promise.resolve({
          id: 73,
          timestamp: '2018-09-25T19:45:36.009Z',
          carShowRid: 3
        })
      );
    });

    it('saves the current ballot', async () => {
      await component.save();
      expect(ballotsService.save).toHaveBeenCalledTimes(1);
      expect(ballotsService.save).toHaveBeenCalledWith({ carShowRid: 3 });
    });

    it('saves the current votes', async () => {
      component.classes[0].carNumber = 295;
      component.classes[3].carNumber = 143;
      component.classes[4].carNumber = 15;
      component.classes[7].carNumber = 78;
      component.classes[9].carNumber = 69;
      component.classes[10].carNumber = 420;

      await component.save();
      expect(votesService.save).toHaveBeenCalledTimes(6);
      expect(votesService.save).toHaveBeenCalledWith({
        carShowBallotRid: 73,
        carShowClassRid: component.classes[0].id,
        carNumber: 295
      });
      expect(votesService.save).toHaveBeenCalledWith({
        carShowBallotRid: 73,
        carShowClassRid: component.classes[3].id,
        carNumber: 143
      });
      expect(votesService.save).toHaveBeenCalledWith({
        carShowBallotRid: 73,
        carShowClassRid: component.classes[4].id,
        carNumber: 15
      });
      expect(votesService.save).toHaveBeenCalledWith({
        carShowBallotRid: 73,
        carShowClassRid: component.classes[7].id,
        carNumber: 78
      });
      expect(votesService.save).toHaveBeenCalledWith({
        carShowBallotRid: 73,
        carShowClassRid: component.classes[9].id,
        carNumber: 69
      });
      expect(votesService.save).toHaveBeenCalledWith({
        carShowBallotRid: 73,
        carShowClassRid: component.classes[10].id,
        carNumber: 420
      });
    });

    it('clears the data allowing for entry of a new ballot', async () => {
      component.classes[0].carNumber = 295;
      component.classes[3].carNumber = 143;
      component.classes[4].carNumber = 15;
      component.classes[7].carNumber = 78;
      component.classes[9].carNumber = 69;
      component.classes[10].carNumber = 420;

      await component.save();
      expect(component.ballot).toEqual({ carShowRid: 3 });
      expect(component.classes).toEqual(
        carShowThreeClasses.filter(c => c.active)
      );
    });
  });

  describe('close', () => {
    it('should go back', () => {
      component.close();
      expect(navController.goBack).toHaveBeenCalledTimes(1);
    });
  });
});
