export function createVotesServiceMock() {
  return jasmine.createSpyObj('VotesService', {
    getAll: Promise.resolve([]),
    save: Promise.resolve({}),
    saveAll: Promise.resolve([]),
  });
}
