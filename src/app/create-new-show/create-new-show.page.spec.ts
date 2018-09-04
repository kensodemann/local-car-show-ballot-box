import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingController, NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { CarShowsService } from '../services/car-shows.service';
import { CreateNewShowPage } from './create-new-show.page';
import { CarShow } from '../models/car-show';

import {
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';

describe('CreateNewShowPage', () => {
  let carShowsService;
  let loadingController;
  let loadingSpinner;
  let navController;
  let carShow: CarShow;
  let component: CreateNewShowPage;
  let fixture: ComponentFixture<CreateNewShowPage>;

  beforeEach(async(() => {
    carShow = {
      date: '2017-08-15',
      name: 'Annual Car Show - 2017',
      year: 2017,
      classes: [
        {
          id: 9,
          name: 'A',
          description: 'Antique through 1954, Cars & Trucks',
          active: true
        },
        {
          id: 10,
          name: 'B',
          description: '1955-1962, Cars Only',
          active: true
        },
        {
          id: 11,
          name: 'C',
          description: '1963-1967, Cars Only',
          active: true
        },
        {
          id: 12,
          name: 'D',
          description: '1968-1970, Cars Only',
          active: true
        }
      ]
    };

    carShowsService = jasmine.createSpyObj('CarShowService', {
      createCarShow: of(carShow),
      save: of({ id: 73, ...carShow })
    });

    loadingSpinner = createOverlayElementMock('LoadingElement');
    loadingController = createOverlayControllerMock(
      'LoadingController',
      loadingSpinner
    );
    navController = createNavControllerMock();

    TestBed.configureTestingModule({
      declarations: [CreateNewShowPage],
      providers: [
        { provide: CarShowsService, useValue: carShowsService },
        { provide: LoadingController, useValue: loadingController },
        { provide: NavController, useValue: navController }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async () => {
    jasmine.clock().mockDate(new Date(2017, 2, 17));
    fixture = TestBed.createComponent(CreateNewShowPage);
    component = fixture.componentInstance;
    await fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('exists', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('creates a new car show', () => {
      expect(carShowsService.createCarShow).toHaveBeenCalledTimes(1);
    });

    it('assigns the car show', () => {
      expect(component.carShow).toEqual(carShow);
    });

    it('shows a loading spinner', () => {
      expect(loadingController.create).toHaveBeenCalledTimes(1);
      expect(loadingSpinner.present).toHaveBeenCalledTimes(1);
    });

    it('dismisses the loading spinner', () => {
      expect(loadingSpinner.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('create show', () => {
    beforeEach(() => {
      loadingController.create.calls.reset();
      loadingSpinner.dismiss.calls.reset();
      loadingSpinner.present.calls.reset();
    });

    it('creates the show', async () => {
      await component.createShow();
      expect(carShowsService.save).toHaveBeenCalledTimes(1);
      expect(carShowsService.save).toHaveBeenCalledWith(carShow);
    });

    it('navigates back to the starting page', async () => {
      await component.createShow();
      expect(navController.goBack).toHaveBeenCalledTimes(1);
    });

    it('shows a loading spinner', async () => {
      await component.createShow();
      expect(loadingController.create).toHaveBeenCalledTimes(1);
      expect(loadingSpinner.present).toHaveBeenCalledTimes(1);
    });

    it('dismisses the loading spinner', async () => {
      await component.createShow();
      expect(loadingSpinner.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
