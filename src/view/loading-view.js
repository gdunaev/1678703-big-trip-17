import {AbstractView} from './abstract-view.js';

const createLoadingTemplate = (isLoading) => {
  if (isLoading) {
    return '<p class="trip-events__msg">Loading...</p>';
  }
  return '';
};

export default class LoadingView extends AbstractView {

  #isLoading = null;

  constructor(isLoading) {
    super();
    this.#isLoading = isLoading;
  }

  getTemplate() {
    return createLoadingTemplate(this.#isLoading);
  }
}


