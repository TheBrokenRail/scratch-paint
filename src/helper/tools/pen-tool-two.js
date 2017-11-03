import paper from '@scratch/paper';
import {MIXED, stylePath} from '../style-path';
import {endPointHit, touching} from '../snapping';
import {drawHitPoint, removeHitPoint} from '../guides';
import {getGuideLayer} from '../../helper/layer';

/**
 * Tool to handle freehand drawing of lines.
 */
class PenTool2 extends paper.Tool {
    static get SNAP_TOLERANCE () {
        return 5;
    }
    /**
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {!function} onUpdateSvg A callback to call when the image visibly changes
     */
    constructor (clearSelectedItems, onUpdateSvg) {
        super();
        this.clearSelectedItems = clearSelectedItems;
        this.onUpdateSvg = onUpdateSvg;

        this.colorState = null;
        this.path = null;
        this.hitResult = null;
        this.cursor = null;

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;

        this.fixedDistance = 2;
        paper.view.on('mouseleave', this.handleMouseLeave);
    }
    handleMouseLeave () {
        if (this.cursor) {
            this.cursor.remove();
            this.cursor = null;
        }
    }
    setColorState (colorState) {
        this.colorState = colorState;
        if (this.path) {
            stylePath(this.path, this.colorState.strokeColor, this.colorState.strokeWidth);
            this.path.fillColor = this.colorState.fillColor === MIXED ? null : this.colorState.fillColor;
        }
    }
    drawHitPoint (hitResult) {
        // If near another path's endpoint, draw hit point to indicate that paths would merge
        if (hitResult) {
            const hitPath = hitResult.path;
            if (hitResult.isFirst) {
                drawHitPoint(hitPath.firstSegment.point);
            } else {
                drawHitPoint(hitPath.lastSegment.point);
            }
        }
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        // If Ctrl Key Pressed Leave The Path Open
        if (event.event.ctrlKey) {
            if (this.cursor) {
                this.cursor.remove();
                this.cursor = null;
            }
            this.path = null;
            this.handleMouseMove(event);
            return;
        }
        if (this.path && !this.path.parent) {
            this.path = null;
        }
        if (!this.path) {
            this.path = new paper.Path();
            stylePath(this.path, this.colorState.strokeColor, this.colorState.strokeWidth);
            this.path.fillColor = this.colorState.fillColor === MIXED ? null : this.colorState.fillColor;
        }
        this.hitResult = endPointHit(event.point, PenTool2.SNAP_TOLERANCE, this.cursor);
        if (this.hitResult) {
            if (this.path &&
                    this.path.firstSegment &&
                    touching(this.path.firstSegment.point, this.hitResult.segment.point, PenTool2.SNAP_TOLERANCE)) {
                // close path
                this.path.closed = true;
                this.path = null;
                this.handleMouseMove(event);
            } else {
                // joining two paths
                if (!this.hitResult.isFirst) {
                    this.hitResult.path.reverse();
                }
                this.path.join(this.hitResult.path);
            }
            removeHitPoint();
            this.hitResult = null;
        } else {
            this.path.add(event.point);
        }
        this.onUpdateSvg();
    }
    handleMouseMove (event) {
        if (event.event.button > 0) return;
        if (this.path && !this.path.parent) {
            this.path = null;
        }
        if (this.cursor) {
            this.cursor.remove();
            this.cursor = null;
        }
        let point;
        if (this.path && this.path.lastSegment) {
            point = this.path.lastSegment.point;
        } else {
            point = event.point;
        }
        this.cursor = new paper.Path();
        this.cursor.opacity = 0.5;
        this.cursor.parent = getGuideLayer();
        this.cursor.data.isHelperItem = true;
        stylePath(this.cursor, this.colorState.strokeColor, this.colorState.strokeWidth);
        this.cursor.add(point);
        this.cursor.add(event.point);
        if (this.hitResult) {
            removeHitPoint();
        }
        this.hitResult = endPointHit(event.point, PenTool2.SNAP_TOLERANCE, this.cursor);
        this.drawHitPoint(this.hitResult);
    }
    deactivateTool () {
        this.fixedDistance = 1;
        if (this.cursor) {
            this.cursor.remove();
            this.cursor = null;
        }
    }
}

export default PenTool2;
