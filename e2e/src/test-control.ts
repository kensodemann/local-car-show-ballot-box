import { browser, by, element, promise } from 'protractor';

export enum Page {
  Root,
  Ballots,
  CarShows,
  CreateNewShow,
  Results
}

const pageUrls = [
  '/',
  '/tabs/(ballots:ballots)',
  '/tabs/(car-shows:car-shows)',
  '/create-new-show',
  '/tabs/(results:results)'
];

export class AppController {
  navigateTo(page: Page): promise.Promise<any> {
    return browser.get(pageUrls[page]);
  }

  getPageTitle(): promise.Promise<string> {
    return element(by.deepCss('app-root ion-title')).getText();
  }
}
