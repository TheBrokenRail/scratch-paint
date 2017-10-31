import log from '../log/log';
const CHANGE_PEN_MODE = 'scratch-paint/pen-mode/CHANGE_PEN_MODE';
const initialState = {brushEnabled: true, pointEnabled: false};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_PEN_MODE:
        return {brushEnabled: !action.mode, pointEnabled: action.mode};
    default:
        return state;
    }
};

// Action creators ==================================
const changePenMode = function (mode) {
    return {
        type: CHANGE_PEN_MODE,
        mode: mode
    };
};

export {
    reducer as default,
    changePenMode
};
