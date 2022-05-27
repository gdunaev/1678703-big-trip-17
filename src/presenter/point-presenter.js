import { render, replace, remove } from '../utils/render.js';
import { isEscEvent } from '../utils/common.js';
import PointEditorView from '../view/point-editor-view.js';
import PointView from '../view/point-view.js';
import {UserAction, UpdateType, ModeEditing, RenderPosition} from '../utils/const.js';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};

export default class PointPresenter {
  #tripEventsMain = null;
  #pointViewEditor = null;
  #pointView = null;
  #mode = null;
  #changeMode = null;
  #changeData = null;
  #offers = null;
  #destinations = null;
  #point = null;

  constructor(tripEventsMain, changeMode, changeData, offers, destinations) {
    this.#tripEventsMain = tripEventsMain;
    this.#mode = ModeEditing.DEFAULT;
    this.#changeMode = changeMode;
    this.#changeData = changeData;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  start(point) {
    this.#point = point;
    const prevPointView = this.#pointView;
    const prevPointViewEditor = this.#pointViewEditor;
    this.#pointViewEditor = new PointEditorView(point, this.#offers, this.#destinations);
    this.#pointView = new PointView(point, this.#offers, this.#destinations);
    this.#pointView.setRollupClickHandler(() => { this.#replaceItemToForm(); });
    this.#pointView.setFavoriteButtonHandler(() => { this.#changeFavoriteButton(); });
    this.#pointViewEditor.setSubmitFormHandler(this.#handleFormSubmit);
    this.#pointViewEditor.setRollupClickHandler(() => { this._replaceFormToItem(); });
    this.#pointViewEditor.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPointView === null || prevPointViewEditor === null) {
      render(this.#tripEventsMain, this.#pointView, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === ModeEditing.DEFAULT) {
      replace(this.#pointView, prevPointView);
    }

    if (this.#mode === ModeEditing.EDITING) {
      replace(this.#pointViewEditor, prevPointViewEditor);
    }

    remove(prevPointView);
    remove(prevPointViewEditor);
  }

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE,
      UpdateType.MINOR,
      point,
    );
  };

  setViewState(state) {
    const resetFormState = () => {
      this.#pointViewEditor.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#pointViewEditor.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#pointViewEditor.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#pointView.shake(resetFormState);
        this.#pointViewEditor.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#pointViewEditor);
  }

  #changeFavoriteButton = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      Object.assign({}, this.#point, { isFavorite: !this.#point.isFavorite, },),
    );
  };

  resetView() {
    if (this.#mode !== ModeEditing.DEFAULT) {
      this.#replaceFormToItem();
    }
  }

  #replaceItemToForm = () => {
    replace(this.#pointViewEditor, this.#pointView);
    document.addEventListener('keydown', this.#onEscPressDown);
    this.#changeMode();
    this.#mode = ModeEditing.EDITING;
  };

  #replaceFormToItem = () => {
    this.#pointViewEditor.resetState(this.#point);
    replace(this.#pointView, this.#pointViewEditor);
    document.removeEventListener('keydown', this.#onEscPressDown);
    this.#mode = ModeEditing.DEFAULT;
  };

  #onEscPressDown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.#replaceFormToItem();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      Object.assign({}, point));

    this.#replaceFormToItem();
  };
}
