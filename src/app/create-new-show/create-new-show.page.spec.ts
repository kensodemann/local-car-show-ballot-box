import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewShowPage } from './create-new-show.page';

describe('CreateNewShowPage', () => {
  let component: CreateNewShowPage;
  let fixture: ComponentFixture<CreateNewShowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewShowPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
