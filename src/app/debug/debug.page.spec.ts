import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugPage } from './debug.page';
import {
  CarClassesService,
  createCarClassesServiceMock
} from '../services/car-classes';
import {
  CarShowsService,
  createCarShowsServiceMock
} from '../services/car-shows';

describe('DebugPage', () => {
  let component: DebugPage;
  let fixture: ComponentFixture<DebugPage>;
  let carClassesService;
  let carShowsService;

  beforeEach(async(() => {
    carClassesService = createCarClassesServiceMock();
    carShowsService = createCarShowsServiceMock();
    TestBed.configureTestingModule({
      declarations: [DebugPage],
      providers: [
        { provide: CarClassesService, useValue: carClassesService },
        { provide: CarShowsService, useValue: carShowsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
