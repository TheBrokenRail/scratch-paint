import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import penIcon from './pen.svg';

const PenModeTwoComponent = props => (
    <ToolSelectComponent
        imgDescriptor={{
            defaultMessage: 'Pen',
            description: 'Label for the pen tool, which draws outlines',
            id: 'paint.penModeTwo.penTwo'
        }}
        imgSrc={penIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

PenModeTwoComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default PenModeTwoComponent;
