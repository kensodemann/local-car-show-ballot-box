export function createCarClassesServiceMock() {
  return jasmine.createSpyObj('CarClassesService', {
    getAll: Promise.resolve([]),
    save: Promise.resolve({}),
    saveAll: Promise.resolve([]),
  });
}
