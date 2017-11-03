import {combineReducers} from 'redux';
import modeReducer from './modes';
import brushModeReducer from './brush-mode';
import penModeReducer from './pen-mode';
import eraserModeReducer from './eraser-mode';
import colorReducer from './color';
import clipboardReducer from './clipboard';
import hoverReducer from './hover';
import modalsReducer from './modals';
import selectedItemReducer from './selected-items';
import undoReducer from './undo';

export default combineReducers({
    mode: modeReducer,
    brushMode: brushModeReducer,
    penMode: penModeReducer,
    eraserMode: eraserModeReducer,
    color: colorReducer,
    clipboard: clipboardReducer,
    hoveredItemId: hoverReducer,
    modals: modalsReducer,
    selectedItems: selectedItemReducer,
    undo: undoReducer
});
