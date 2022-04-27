import {AbstractView} from "./abstract.js";

const createLoadingTemplate = (isLoading) => {

    if (isLoading) {
        return `<p class="trip-events__msg">Loading...</p>`;
    }
    return '';

};

export default class LoadingView extends AbstractView {
  constructor(isLoading) {
      super();
      this._isLoading = isLoading;
  }
  getTemplate() {
      return createLoadingTemplate(this._isLoading);
  }
}


