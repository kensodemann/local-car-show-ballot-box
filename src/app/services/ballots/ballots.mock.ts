export function createBallotsServiceMock() {
  return jasmine.createSpyObj('BallotsService', {
    getAll: Promise.resolve([]),
    save: Promise.resolve({})
  });
}
