export function createOverlayElementMock(name: string) {
  return jasmine.createSpyObj(name, ['present']);
}

export function createOverlayControllerMock(name: string, element?: any) {
  return jasmine.createSpyObj(name, {
    create: Promise.resolve(element),
    dismiss: undefined
  });
}

// NOTE: the next BETA will have breaking changes where these become navigateForward and navigateRoot
export function createNavControllerMock() {
  return jasmine.createSpyObj('NavController', ['goForward', 'goRoot']);
}

export function createIdentityMock() {
  return jasmine.createSpyObj('Identity', {
    get: Promise.resolve(),
    remove: undefined,
    set: undefined
  });
}

export function createStorageMock() {
  return jasmine.createSpyObj('Storage', {
    get: Promise.resolve(),
    ready: Promise.resolve(),
    remove: Promise.resolve(),
    set: Promise.resolve()
  });
}
