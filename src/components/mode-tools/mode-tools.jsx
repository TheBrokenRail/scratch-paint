import classNames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import {changeBrushSize} from '../../reducers/brush-mode';
import {changePenMode} from '../../reducers/pen-mode';
import {changeBrushSize as changeEraserSize} from '../../reducers/eraser-mode';

import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Input from '../forms/input.jsx';
import InputGroup from '../input-group/input-group.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
// import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import Modes from '../../modes/modes';
import styles from './mode-tools.css';

import copyIcon from './icons/copy.svg';
import pasteIcon from './icons/paste.svg';

import brushIcon from '../brush-mode/brush.svg';
import penIcon from '../pen-mode/pen.svg';
import curvedPointIcon from './icons/curved-point.svg';
import eraserIcon from '../eraser-mode/eraser.svg';
// import flipHorizontalIcon from './icons/flip-horizontal.svg';
// import flipVerticalIcon from './icons/flip-vertical.svg';
import straightPointIcon from './icons/straight-point.svg';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import {MAX_STROKE_WIDTH} from '../../reducers/stroke-width';

const BufferedInput = BufferedInputHOC(Input);
const ModeToolsComponent = props => {
    const messages = defineMessages({
        brushSize: {
            defaultMessage: 'Brush size',
            description: 'Label for the brush size input',
            id: 'paint.modeTools.brushSize'
        },
        eraserSize: {
            defaultMessage: 'Eraser size',
            description: 'Label for the eraser size input',
            id: 'paint.modeTools.eraserSize'
        },
        copy: {
            defaultMessage: 'Copy',
            description: 'Label for the copy button',
            id: 'paint.modeTools.copy'
        },
        paste: {
            defaultMessage: 'Paste',
            description: 'Label for the paste button',
            id: 'paint.modeTools.paste'
        },
        pen: {
            defaultMessage: 'Pen',
            description: 'Label for the pen tool, which draws outlines',
            id: 'paint.penMode.pen'
        }
    });

    switch (props.mode) {
    case Modes.BRUSH:
        return (
            <div className={classNames(props.className, styles.modeTools)}>
                <div>
                    <img
                        alt={props.intl.formatMessage(messages.brushSize)}
                        className={styles.modeToolsIcon}
                        src={brushIcon}
                    />
                </div>
                <BufferedInput
                    small
                    max={MAX_STROKE_WIDTH}
                    min="1"
                    type="number"
                    value={props.brushValue}
                    onSubmit={props.onBrushSliderChange}
                />
            </div>
        );
    case Modes.ERASER:
        return (
            <div className={classNames(props.className, styles.modeTools)}>
                <div>
                    <img
                        alt={props.intl.formatMessage(messages.eraserSize)}
                        className={styles.modeToolsIcon}
                        src={eraserIcon}
                    />
                </div>
                <BufferedInput
                    small
                    max={MAX_STROKE_WIDTH}
                    min="1"
                    type="number"
                    value={props.eraserValue}
                    onSubmit={props.onEraserSliderChange}
                />
            </div>
        );
    case Modes.RESHAPE:
        return (
            <div className={classNames(props.className, styles.modeTools)}>
                {/* <LabeledIconButton
                    imgAlt="Curved Point Icon"
                    imgSrc={curvedPointIcon}
                    title="Curved"
                    onClick={function () {}}
                />
                <LabeledIconButton
                    imgAlt="Straight Point Icon"
                    imgSrc={straightPointIcon}
                    title="Pointed"
                    onClick={function () {}}
                /> */}
            </div>
        );
    case Modes.SELECT:
        return (
            <div className={classNames(props.className, styles.modeTools)}>
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        disabled
                        imgSrc={copyIcon}
                        title={props.intl.formatMessage(messages.copy)}
                        onClick={function () {}}
                    />
                    <LabeledIconButton
                        disabled
                        imgSrc={pasteIcon}
                        title={props.intl.formatMessage(messages.paste)}
                        onClick={function () {}}
                    />
                </InputGroup>
                {/* <LabeledIconButton
                    imgAlt="Flip Horizontal Icon"
                    imgSrc={flipHorizontalIcon}
                    title="Flip Horizontal"
                    onClick={function () {}}
                />
                <LabeledIconButton
                    imgAlt="Flip Vertical Icon"
                    imgSrc={flipVerticalIcon}
                    title="Flip Vertical"
                    onClick={function () {}}
                /> */}
            </div>
        );
    case Modes.PEN:
        return (
            <div className={classNames(props.className, styles.modeTools)}>
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <div>
                        <img
                            alt={props.intl.formatMessage(messages.pen)}
                            className={styles.modeToolsIcon}
                            src={penIcon}
                        />
                    </div>
                    <ToolSelectComponent
                        imgDescriptor={{
                            defaultMessage: 'Brush Mode',
                            description: 'Pen Brush Mode',
                            id: 'paint.penMode.brush'
                        }}
                        imgSrc={curvedPointIcon}
                        isSelected={props.brushPenMode}
                        onMouseDown={props.onPenModeBrush}
                    />
                    <ToolSelectComponent
                        imgDescriptor={{
                            defaultMessage: 'Point Mode',
                            description: 'Pen Point Mode',
                            id: 'paint.penMode.point'
                        }}
                        imgSrc={straightPointIcon}
                        isSelected={props.pointPenMode}
                        onMouseDown={props.onPenModePoint}
                    />
                </InputGroup>
            </div>
        );
    default:
        // Leave empty for now, if mode not supported
        return (
            <div className={classNames(props.className, styles.modeTools)} />
        );
    }
};

ModeToolsComponent.propTypes = {
    brushPenMode: PropTypes.bool,
    brushValue: PropTypes.number,
    className: PropTypes.string,
    eraserValue: PropTypes.number,
    intl: intlShape.isRequired,
    mode: PropTypes.string.isRequired,
    onBrushSliderChange: PropTypes.func,
    onEraserSliderChange: PropTypes.func,
    onPenModeBrush: PropTypes.func,
    onPenModePoint: PropTypes.func,
    pointPenMode: PropTypes.bool
};

const mapStateToProps = state => ({
    mode: state.scratchPaint.mode,
    brushValue: state.scratchPaint.brushMode.brushSize,
    eraserValue: state.scratchPaint.eraserMode.brushSize,
    brushPenMode: state.scratchPaint.penMode.brushEnabled,
    pointPenMode: state.scratchPaint.penMode.pointEnabled
});
const mapDispatchToProps = dispatch => ({
    onBrushSliderChange: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    onEraserSliderChange: eraserSize => {
        dispatch(changeEraserSize(eraserSize));
    },
    onPenModeBrush: () => {
        dispatch(changePenMode(false));
    },
    onPenModePoint: () => {
        dispatch(changePenMode(true));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ModeToolsComponent));
