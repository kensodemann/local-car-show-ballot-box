import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCarShowComponent } from './current-car-show.component';
import { testCarShowsOld } from '../../services/car-shows';
import { deepCopy } from '../../../../test/util';

describe('CurrentCarShowComponent', () => {
  let component: CurrentCarShowComponent;
  let fixture: ComponentFixture<CurrentCarShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentCarShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentCarShowComponent);
    component = fixture.componentInstance;
    component.carShow = deepCopy(testCarShowsOld.find(c => c.id === 2));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
