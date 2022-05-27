import { render, remove } from '../utils/render.js';
import { isEscEvent } from '../utils/common.js';
import PointEditorView from '../view/point-editor-view.js';
import { UserAction, UpdateType, RenderPosition } from '../utils/const.js';


export default class PointNewPresenter {
  #pointViewEditor = null;
  #changeData = null;

  constructor(changeData) {
    this.#changeData = changeData;
  }

  #getEmptyPoint = () => ({
    'id': '',
    'typePoint': '',
    'basePrice': 0,
    'dateFrom': '',
    'dateTo': '',
    'destination': {
      'name': '',
      'description': '',
      'pictures': [],
    },
    'isFavorite': false,
    'offers': [],
  });

  start(offers, destinations) {
    if (this.#pointViewEditor !== null) {
      this.destroy();
      return;
    }
    const tripEventsTripSort = document.querySelector('.trip-events__trip-sort');
    const state = this.#getEmptyPoint();
    this.#pointViewEditor = new PointEditorView(state, offers, destinations);
    this.#pointViewEditor.setSubmitFormHandler(this.#handleFormSubmit);
    this.#pointViewEditor.setDeleteClickHandler(this.#setDeleteHandler);
    this.#pointViewEditor.setRollupClickHandler(this.#setDeleteHandler);
    document.addEventListener('keydown', this.#onEscPressDown);
    document.querySelector('.trip-main__event-add-btn').disabled = true;

    render(tripEventsTripSort, this.#pointViewEditor, RenderPosition.AFTEREND);
  }

  setSaving() {
    this.#pointViewEditor.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointViewEditor.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#pointViewEditor.shake(resetFormState);
  }

  #setDeleteHandler = () => {
    this.destroy();
  };

  destroy() {
    if (this.#pointViewEditor === null) {
      return;
    }

    remove(this.#pointViewEditor);
    this.#pointViewEditor = null;

    document.removeEventListener('keydown', this.#onEscPressDown);
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }

  #onEscPressDown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD,
      UpdateType.MINOR,
      point,
    );
  };
}
