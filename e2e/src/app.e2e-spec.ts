import { Page, AppController } from './test-control';

describe('Application', () => {
  let app: AppController;

  beforeEach(() => {
    app = new AppController();
  });

  it('Defaults to Car Shows page', () => {
    app.navigateTo(Page.Root);
    expect(app.getPageTitle()).toEqual('Car Shows');
  });

  it('allows browsing to car shows', () => {
    app.navigateTo(Page.CarShows);
    expect(app.getPageTitle()).toEqual('Car Shows');
  });

  it('allows browsing to ballots', () => {
    app.navigateTo(Page.Ballots);
    expect(app.getPageTitle()).toEqual('Ballots');
  });

  it('allows browsing to results', () => {
    app.navigateTo(Page.Results);
    expect(app.getPageTitle()).toEqual('Results');
  });

  it('allows browsing to the "Create New Show" page', () => {
    app.navigateTo(Page.CreateNewShow);
    expect(app.getPageTitle()).toEqual('Car Show');
  });
});
