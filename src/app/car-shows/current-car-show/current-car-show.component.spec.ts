import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  CarClassesService,
  createCarClassesServiceMock,
  testCarShowClasses
} from '../../services/car-classes';
import { CurrentCarShowComponent } from './current-car-show.component';
import { testCarShows } from '../../services/car-shows';
import { deepCopy } from '../../../../test/util';

describe('CurrentCarShowComponent', () => {
  let component: CurrentCarShowComponent;
  let fixture: ComponentFixture<CurrentCarShowComponent>;
  let carClassesService;
  let carShowClassesPromise;
  let carShowClasses;

  beforeEach(async(() => {
    carClassesService = createCarClassesServiceMock();
    carShowClasses = testCarShowClasses.filter(c => c.carShowRid === 2);
    carShowClassesPromise = Promise.resolve(carShowClasses);
    carClassesService.getAll.and.returnValue(carShowClassesPromise);
    TestBed.configureTestingModule({
      declarations: [CurrentCarShowComponent],
      providers: [{ provide: CarClassesService, useValue: carClassesService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentCarShowComponent);
    component = fixture.componentInstance;
    component.carShow = deepCopy(testCarShows.find(c => c.id === 2));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get the car classes', () => {
    expect(carClassesService.getAll).toHaveBeenCalledTimes(1);
    expect(carClassesService.getAll).toHaveBeenCalledWith(2);
  });

  it('assigns the car show classes', async () => {
    await carShowClassesPromise;
    expect(component.carShowClasses).toEqual(carShowClasses);
  });
});
