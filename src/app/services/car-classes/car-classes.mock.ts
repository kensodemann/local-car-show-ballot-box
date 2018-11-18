export function createCarClassesServiceMock() {
  return jasmine.createSpyObj('CarClassesService', {
    getAll: Promise.resolve([])
  });
}
