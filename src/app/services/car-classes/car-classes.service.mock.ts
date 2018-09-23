import { of } from 'rxjs';

export function createCarClassesServiceMock() {
  return jasmine.createSpyObj('CarClassesService', {
    getAll: of([])
  });
}
