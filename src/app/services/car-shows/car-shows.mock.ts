import { Subject } from 'rxjs';

export function createCarShowsServiceMock() {
  const carShowsServiceMock = jasmine.createSpyObj('CarShowsService', {
    getAll: Promise.resolve([]),
    getCurrent: Promise.resolve(),
    save: Promise.resolve()
  });
  carShowsServiceMock.changed = new Subject();
  return carShowsServiceMock;
}
