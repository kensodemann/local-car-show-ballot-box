export function createOverlayElementMock(name: string) {
  return jasmine.createSpyObj(name, ['present']);
}

export function createOverlayControllerMock(name: string, element?: any) {
  return jasmine.createSpyObj(name, {
    create: Promise.resolve(element),
    dismiss: undefined
  });
}

export function createNavControllerMock() {
  return jasmine.createSpyObj('NavController', ['goForward']);
}
