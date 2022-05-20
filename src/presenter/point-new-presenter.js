import { render, remove } from '../utils/render.js';
import { isEscEvent } from '../utils/common.js';
import PointEditorView from '../view/point-editor-view.js';
import { UserAction, UpdateType, ModeEditing, RenderPosition } from '../utils/const.js';



export default class PointNewPresenter {
    constructor(changeData) {
      this._tripEventsTripSort = null;
        this._pointViewEditor = null;
        this._mode = ModeEditing.DEFAULT;
        this._changeData = changeData;
        this._state = this._getEmptyPoint();
        this._onEscPressDown = this._onEscPressDown.bind(this);
        this._handleFormSubmit = this._handleFormSubmit.bind(this);
        this._setDeleteHandler = this._setDeleteHandler.bind(this);
        this._points = [];
        this._offers = [];
        this._destinations = [];
    }

    _getEmptyPoint() {
        return {
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
        };
    }

    start(points, offers, destinations) {
        if (this._pointViewEditor !== null) {
            this.destroy();
            return;
        }
        this._tripEventsTripSort = document.querySelector('.trip-events__trip-sort');
        this._points = points;
        this._offers = offers;
        this._destinations = destinations;
        this._pointViewEditor = new PointEditorView(this._state, offers, destinations);
        this._pointViewEditor.setSubmitFormHandler(this._handleFormSubmit);
        this._pointViewEditor.setDeleteClickHandler(this._setDeleteHandler);
        this._pointViewEditor.setRollupClickHandler(this._setDeleteHandler);
        document.addEventListener('keydown', this._onEscPressDown);
        document.querySelector('.trip-main__event-add-btn').disabled = true;

        render(this._tripEventsTripSort, this._pointViewEditor, RenderPosition.AFTEREND);
    }

    setSaving() {

        this._pointViewEditor.updateData({
          isDisabled: true,
          isSaving: true,
        });
    }

    setAborting() {
        const resetFormState = () => {
                this._pointViewEditor.updateData({
                isDisabled: false,
                isSaving: false,
                isDeleting: false,
                });
        };
        this._pointViewEditor.shake(resetFormState);
    }

    _setDeleteHandler() {
        this.destroy();
    }

    destroy() {
        if (this._pointViewEditor === null) {
            return;
        }

        remove(this._pointViewEditor);
        this._pointViewEditor = null;

        document.removeEventListener('keydown', this._onEscPressDown);
        document.querySelector('.trip-main__event-add-btn').disabled = false;
    }

    _onEscPressDown(evt) {
        if (isEscEvent(evt)) {
            evt.preventDefault();
            this.destroy();
        }
    }

    _handleFormSubmit(point) {

        this._changeData(
            UserAction.ADD,
            UpdateType.MINOR,
            point,
        );
    }
}
