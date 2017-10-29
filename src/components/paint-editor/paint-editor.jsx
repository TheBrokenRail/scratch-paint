import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';

import PaperCanvas from '../../containers/paper-canvas.jsx';

import {shouldShowGroup, shouldShowUngroup} from '../../helper/group';
import {shouldShowBringForward, shouldShowSendBackward} from '../../helper/order';

import Button from '../button/button.jsx';
import ButtonGroup from '../button-group/button-group.jsx';
import BrushMode from '../../containers/brush-mode.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import EraserMode from '../../containers/eraser-mode.jsx';
import FillColorIndicatorComponent from '../../containers/fill-color-indicator.jsx';
import Input from '../forms/input.jsx';
import InputGroup from '../input-group/input-group.jsx';
import Label from '../forms/label.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import LineMode from '../../containers/line-mode.jsx';
import ModeToolsComponent from '../mode-tools/mode-tools.jsx';
import OvalMode from '../../containers/oval-mode.jsx';
import PenMode from '../../containers/pen-mode.jsx';
import PenModeTwo from '../../containers/pen-mode-two.jsx';
import RectMode from '../../containers/rect-mode.jsx';
import ReshapeMode from '../../containers/reshape-mode.jsx';
import SelectMode from '../../containers/select-mode.jsx';
import StrokeColorIndicatorComponent from '../../containers/stroke-color-indicator.jsx';
import StrokeWidthIndicatorComponent from '../../containers/stroke-width-indicator.jsx';

import styles from './paint-editor.css';

import groupIcon from './group.svg';
import redoIcon from './redo.svg';
import sendBackIcon from './send-back.svg';
import sendBackwardIcon from './send-backward.svg';
import sendForwardIcon from './send-forward.svg';
import sendFrontIcon from './send-front.svg';
import undoIcon from './undo.svg';
import ungroupIcon from './ungroup.svg';
import zoomInIcon from './zoom-in.svg';
import zoomOutIcon from './zoom-out.svg';
import zoomResetIcon from './zoom-reset.svg';

const BufferedInput = BufferedInputHOC(Input);
const messages = defineMessages({
    costume: {
        id: 'paint.paintEditor.costume',
        description: 'Label for the name of a sound',
        defaultMessage: 'Costume'
    }
});

class PaintEditorComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setCanvas'
        ]);
        this.state = {};
    }
    setCanvas (canvas) {
        this.setState({canvas: canvas});
    }
    render () {
        const redoDisabled = !this.props.canRedo();
        const undoDisabled = !this.props.canUndo();

        return (
            <div className={styles.editorContainer}>
                {this.state.canvas ? (
                    <div className={styles.editorContainerTop}>
                        {/* First row */}
                        <div className={styles.row}>
                            {/* Name field */}
                            <InputGroup>
                                <Label text={this.props.intl.formatMessage(messages.costume)}>
                                    <BufferedInput
                                        type="text"
                                        value={this.props.name}
                                        onSubmit={this.props.onUpdateName}
                                    />
                                </Label>
                            </InputGroup>

                            {/* Undo/Redo */}
                            <InputGroup>
                                <ButtonGroup>
                                    <Button
                                        className={
                                            classNames(
                                                styles.buttonGroupButton,
                                                {
                                                    [styles.modNoRightBorder]: !redoDisabled
                                                }
                                            )
                                        }
                                        disabled={undoDisabled}
                                        onClick={this.props.onUndo}
                                    >
                                        <img
                                            alt="Undo"
                                            className={styles.buttonGroupButtonIcon}
                                            src={undoIcon}
                                        />
                                    </Button>
                                    <Button
                                        className={
                                            classNames(
                                                styles.buttonGroupButton,
                                                {
                                                    [styles.modLeftBorder]: !redoDisabled
                                                }
                                            )
                                        }
                                        disabled={redoDisabled}
                                        onClick={this.props.onRedo}
                                    >
                                        <img
                                            alt="Redo"
                                            className={styles.buttonGroupButtonIcon}
                                            src={redoIcon}
                                        />
                                    </Button>
                                </ButtonGroup>
                            </InputGroup>

                            {/* Group/Ungroup */}
                            <InputGroup className={styles.modDashedBorder}>
                                <LabeledIconButton
                                    disabled={!shouldShowGroup()}
                                    imgAlt="Group"
                                    imgSrc={groupIcon}
                                    title="Group"
                                    onClick={this.props.onGroup}
                                />
                                <LabeledIconButton
                                    disabled={!shouldShowUngroup()}
                                    imgAlt="Ungroup"
                                    imgSrc={ungroupIcon}
                                    title="Ungroup"
                                    onClick={this.props.onUngroup}
                                />
                            </InputGroup>

                            {/* Forward/Backward */}
                            <InputGroup className={styles.modDashedBorder}>
                                <LabeledIconButton
                                    disabled={!shouldShowBringForward()}
                                    imgAlt="Send Forward"
                                    imgSrc={sendForwardIcon}
                                    title="Forward"
                                    onClick={this.props.onSendForward}
                                />
                                <LabeledIconButton
                                    disabled={!shouldShowSendBackward()}
                                    imgAlt="Send Backward"
                                    imgSrc={sendBackwardIcon}
                                    title="Backward"
                                    onClick={this.props.onSendBackward}
                                />
                            </InputGroup>

                            {/* Front/Back */}
                            <InputGroup>
                                <LabeledIconButton
                                    disabled={!shouldShowBringForward()}
                                    imgAlt="Send to Front"
                                    imgSrc={sendFrontIcon}
                                    title="Front"
                                    onClick={this.props.onSendToFront}
                                />
                                <LabeledIconButton
                                    disabled={!shouldShowSendBackward()}
                                    imgAlt="Send to Back"
                                    imgSrc={sendBackIcon}
                                    title="Back"
                                    onClick={this.props.onSendToBack}
                                />
                            </InputGroup>

                            {/* To be rotation point */}
                            {/* <InputGroup>
                                <LabeledIconButton
                                    imgAlt="Rotation Point"
                                    imgSrc={rotationPointIcon}
                                    title="Rotation Point"
                                    onClick={function () {}}
                                />
                            </InputGroup> */}
                        </div>

                        {/* Second Row */}
                        <div className={styles.row}>
                            <div className={classNames(styles.row, styles.modDashedBorder)}>
                                {/* fill */}
                                <FillColorIndicatorComponent
                                    onUpdateSvg={this.props.onUpdateSvg}
                                />
                                {/* stroke */}
                                <StrokeColorIndicatorComponent
                                    onUpdateSvg={this.props.onUpdateSvg}
                                />
                                {/* stroke width */}
                                <StrokeWidthIndicatorComponent
                                    onUpdateSvg={this.props.onUpdateSvg}
                                />
                            </div>
                            <InputGroup className={styles.modModeTools}>
                                <ModeToolsComponent />
                            </InputGroup>
                        </div>
                    </div>
                ) : null}

                <div className={styles.topAlignRow}>
                    {/* Modes */}
                    {this.state.canvas ? (
                        <div className={styles.modeSelector}>
                            <SelectMode
                                onUpdateSvg={this.props.onUpdateSvg}
                            />
                            <ReshapeMode
                                onUpdateSvg={this.props.onUpdateSvg}
                            />
                            <BrushMode
                                onUpdateSvg={this.props.onUpdateSvg}
                            />
                            <EraserMode
                                onUpdateSvg={this.props.onUpdateSvg}
                            />
                            <PenMode
                                onUpdateSvg={this.props.onUpdateSvg}
                            />
                            <PenModeTwo
                                onUpdateSvg={this.props.onUpdateSvg}
                            />
                            {/* Text mode will go here */}
                            <LineMode
                                onUpdateSvg={this.props.onUpdateSvg}
                            />
                            <OvalMode
                                onUpdateSvg={this.props.onUpdateSvg}
                            />
                            <RectMode
                                onUpdateSvg={this.props.onUpdateSvg}
                            />
                        </div>
                    ) : null}

                    {/* Canvas */}
                    <div className={styles.canvasContainer}>
                        <PaperCanvas
                            canvasRef={this.setCanvas}
                            rotationCenterX={this.props.rotationCenterX}
                            rotationCenterY={this.props.rotationCenterY}
                            svg={this.props.svg}
                            svgId={this.props.svgId}
                            onUpdateSvg={this.props.onUpdateSvg}
                        />
                        {/* Zoom controls */}
                        <InputGroup className={styles.zoomControls}>
                            <ButtonGroup>
                                <Button
                                    className={styles.buttonGroupButton}
                                    onClick={this.props.onZoomIn}
                                >
                                    <img
                                        alt="Zoom In"
                                        className={styles.buttonGroupButtonIcon}
                                        src={zoomInIcon}
                                    />
                                </Button>
                                <Button
                                    className={styles.buttonGroupButton}
                                    onClick={this.props.onZoomReset}
                                >
                                    <img
                                        alt="Zoom Reset"
                                        className={styles.buttonGroupButtonIcon}
                                        src={zoomResetIcon}
                                    />
                                </Button>
                                <Button
                                    className={styles.buttonGroupButton}
                                    onClick={this.props.onZoomOut}
                                >
                                    <img
                                        alt="Zoom Out"
                                        className={styles.buttonGroupButtonIcon}
                                        src={zoomOutIcon}
                                    />
                                </Button>
                            </ButtonGroup>
                        </InputGroup>
                    </div>
                </div>
            </div>
        );
    }
}

PaintEditorComponent.propTypes = {
    canRedo: PropTypes.func.isRequired,
    canUndo: PropTypes.func.isRequired,
    intl: intlShape,
    name: PropTypes.string,
    onGroup: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onSendBackward: PropTypes.func.isRequired,
    onSendForward: PropTypes.func.isRequired,
    onSendToBack: PropTypes.func.isRequired,
    onSendToFront: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onUngroup: PropTypes.func.isRequired,
    onUpdateName: PropTypes.func.isRequired,
    onUpdateSvg: PropTypes.func.isRequired,
    onZoomIn: PropTypes.func.isRequired,
    onZoomOut: PropTypes.func.isRequired,
    onZoomReset: PropTypes.func.isRequired,
    rotationCenterX: PropTypes.number,
    rotationCenterY: PropTypes.number,
    svg: PropTypes.string,
    svgId: PropTypes.string
};

export default injectIntl(PaintEditorComponent);
