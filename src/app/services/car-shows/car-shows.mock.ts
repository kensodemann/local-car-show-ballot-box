import { of, Subject } from 'rxjs';

export function createCarShowsServiceMock() {
  const carShowsServiceMock = jasmine.createSpyObj('CarShowsService', {
    getAll: of([]),
    getCurrent: of(null),
    save: of(null),
    createCarShow: of(null)
  });
  carShowsServiceMock.changed = new Subject();
  return carShowsServiceMock;
}
