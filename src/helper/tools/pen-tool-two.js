import paper from '@scratch/paper';
import {stylePath} from '../style-path';
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
        this.pointer = null;

        // Piece of whole path that was added by last stroke. Used to smooth just the added part.
        this.subpath = null;
        this.subpathIndex = 0;

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;

        this.fixedDistance = 2;
    }
    setColorState (colorState) {
        this.colorState = colorState;
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
        if (!this.path) {
            this.path = new paper.Path();
            stylePath(this.path, this.colorState.strokeColor, this.colorState.strokeWidth);
        }
        this.hitResult = endPointHit(event.point, PenTool2.SNAP_TOLERANCE, this.cursor);
        if (this.hitResult) {
            if (touching(this.path.firstSegment.point, this.hitResult.segment.point, PenTool2.SNAP_TOLERANCE)) {
                // close path
                this.path.closed = true;
                this.path = null;
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
        if (this.pointer) {
            this.pointer.remove();
            this.pointer = null;
        }
    }
    handleMouseMove (event) {
        if (event.event.button > 0) return;
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
        stylePath(this.cursor, this.colorState.strokeColor, this.colorState.strokeWidth);
        this.cursor.add(point);
        this.cursor.add(event.point);
        if (this.hitResult) {
            removeHitPoint();
        }
        this.hitResult = endPointHit(event.point, PenTool2.SNAP_TOLERANCE, this.cursor);
        this.drawHitPoint(this.hitResult);
        if (!this.path) {
            if (this.pointer) {
                this.pointer.remove();
                this.pointer = null;
            }
            const newPreview = new paper.Path.Circle({
                center: event.point,
                radius: this.colorState.strokeWidth / 2
            });
            newPreview.parent = getGuideLayer();
            newPreview.strokeWidth = this.colorState.strokeWidth;
            newPreview.fillColor = this.colorState.strokeColor;
            newPreview.strokeColor = this.colorState.strokeColor;
            this.pointer = newPreview;
            this.pointer.position = event.point;
        }
    }
    deactivateTool () {
        this.fixedDistance = 1;
        if (this.cursor) {
            this.cursor.remove();
            this.cursor = null;
        }
        if (this.pointer) {
            this.pointer.remove();
            this.pointer = null;
        }
    }
}

export default PenTool2;
