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
  constructor(tripEventsMain, changeMode, changeData, offers, destinations) {
    this._tripEventsMain = tripEventsMain;
    this._pointViewEditor = null;
    this._pointView = null;
    this._onEscPressDown = this._onEscPressDown.bind(this);
    this._mode = ModeEditing.DEFAULT;
    this._changeMode = changeMode;
    this._changeData = changeData;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._offers = offers;
    this._destinations = destinations;
    this._pointViewEditor = null;
    this._pointView = null;
  }

  start(point) {
    this._point = point;
    const prevPointView = this._pointView;
    const prevPointViewEditor = this._pointViewEditor;
    this._pointViewEditor = new PointEditorView(point, this._offers, this._destinations);
    this._pointView = new PointView(point, this._offers, this._destinations);
    this._pointView.setRollupClickHandler(() => { this._replaceItemToForm(); });
    this._pointView.setFavoriteButtonHandler(() => { this._changeFavoriteButton(); });
    this._pointViewEditor.setSubmitFormHandler(this._handleFormSubmit);
    this._pointViewEditor.setRollupClickHandler(() => { this._replaceFormToItem(); });
    this._pointViewEditor.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointView === null || prevPointViewEditor === null) {
      render(this._tripEventsMain, this._pointView, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === ModeEditing.DEFAULT) {
      replace(this._pointView, prevPointView);
    }

    if (this._mode === ModeEditing.EDITING) {
      replace(this._pointViewEditor, prevPointViewEditor);
    }

    remove(prevPointView);
    remove(prevPointViewEditor);
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE,
      UpdateType.MINOR,
      point,
    );
  }

  setViewState(state) {

    // console.log('222', state)

    const resetFormState = () => {
      this._pointViewEditor.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointViewEditor.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointViewEditor.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
          this._pointView.shake(resetFormState);
          this._pointViewEditor.shake(resetFormState);
          break;
    }
  }

  

  destroy() {
    remove(this._pointView);
    remove(this._pointViewEditor);
  }

  _changeFavoriteButton() {
      this._changeData(
        UserAction.UPDATE,
        UpdateType.PATCH,
        Object.assign({}, this._point, { isFavorite: !this._point.isFavorite, },),
      );
  }

  resetView() {
    if (this._mode !== ModeEditing.DEFAULT) {
      this._replaceFormToItem();
    }
  }

  _replaceItemToForm() {
    replace(this._pointViewEditor, this._pointView);
    document.addEventListener('keydown', this._onEscPressDown);
    this._changeMode();
    this._mode = ModeEditing.EDITING;
  }

  _replaceFormToItem() {
    this._pointViewEditor.resetState(this._point);
    replace(this._pointView, this._pointViewEditor);
    document.removeEventListener('keydown', this._onEscPressDown);
    this._mode = ModeEditing.DEFAULT;
  }

  _onEscPressDown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._replaceFormToItem();
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      Object.assign({}, point));

    this._replaceFormToItem();
  }
}
