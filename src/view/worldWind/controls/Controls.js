
import S from 'string';

import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import './Controls.css';

/**
 * Constructs a view controls layer.
 * @alias Controls
 * @constructor
 * @param {Object} options
 * @param {WorldWindow} options.worldWindow The World Window associated with these controls.
 * @param {JQuery} options.mapContainer selector of target container, where should be the controls rendered
 * @param {string} options.mapContainerClass instead of selector could be a class provided
 * @param {string}[options.type] Optional parameter, which specifies, which type of Controls will be rendered
 * @param {string}[options.classes] Optional parameter.
 * @throws {ArgumentError} If the specified world window is null or undefined.
 */
let $ = window.$;
class Controls {
    constructor(options) {
        if (!options.worldWindow) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Controls", "constructor", "missingWorldWindow"));
        }
        if (!options.mapContainer && !options.mapContainerClass) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Controls", "constructor", "missingTarget"));
        }

		/**
         * @type {string}
		 */
		this._type = options.type;

        if (options.mapContainer){
			this._mapContainer = options.mapContainer;
        } else if (options.mapContainerClass){
            this._mapContainer = $('.' + options.mapContainerClass);
        }

        this._classes = options.classes;

        /**
         * The World Window associated with controls.
         * @type {WorldWindow}
         * @readonly
         */
        this.wwd = options.worldWindow;

        /**
         * The incremental vertical exaggeration to apply each cycle.
         * @type {Number}
         * @default 0.01
         */
        this.exaggerationIncrement = 1;

        /**
         * The incremental amount to increase or decrease the eye distance (for zoom) each cycle.
         * @type {Number}
         * @default 0.04 (4%)
         */
        this.zoomIncrement = 0.04;

        /**
         * The incremental amount to increase or decrease the heading each cycle, in degrees.
         * @type {Number}
         * @default 1.0
         */
        this.headingIncrement = 1.0;

        /**
         * The incremental amount to increase or decrease the tilt each cycle, in degrees.
         * @type {Number}
         */
        this.tiltIncrement = 1.0;

        /**
         * The incremental amount to narrow or widen the field of view each cycle, in degrees.
         * @type {Number}
         * @default 0.1
         */
        this.fieldOfViewIncrement = 0.1;

        /**
         * The scale factor governing the pan speed. Increased values cause faster panning.
         * @type {Number}
         * @default 0.001
         */
        this.panIncrement = 0.001;

        this.wwds = [this.wwd];

        // Render icons
        this.buildIcons();

        // Establish event handlers.
        this.setupInteraction();
    };

    /**
     * Add another World window which will be controlled by this control
     * @param wwd {WorldWindow}
     */
    addWorldWindow(wwd) {
        this.wwds.push(wwd);
    };

    /**
     * Render icons
     */
    buildIcons() {
        let html = S(`
        <div class="map-controls ${this._classes}">
            <div class="exaggerate-control control">
                <a href="#" class="exaggerate-plus-control"><i class="fa fa-arrow-up"></i></a>
                <a href="#" class="exaggerate-minus-control"><i class="fa fa-arrow-down"></i></a>
            </div>
            <div class="zoom-control control">
                <a href="#" class="zoom-plus-control"><i class="fa fa-plus"></i></a>
                <a href="#" class="zoom-minus-control"><i class="fa fa-minus"></i></a>
            </div>
            <div class="rotate-control control">
                <a href="#" class="rotate-right-control"><i class="fa fa-rotate-right"></i></a>
                <a href="#" class="rotate-needle-control"><i class="fa fa-location-arrow"></i></a>
                <a href="#" class="rotate-left-control"><i class="fa fa-rotate-left"></i></a>
            </div>
            <div class="tilt-control control">
                <a href="#" class="tilt-more-control">
                    <svg version="1.1" class="icon-tilt-more" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="18px" height="18px" viewBox="0 0 511.625 511.627" enable-background="new 0 0 511.625 511.627"
             xml:space="preserve">
        <g>
            <path d="M224.595,201.822h-93.576c-6.879,0-13.674,3.236-15.211,7.307l-24.902,66.025c-2.188,5.797,2.867,10.61,11.34,10.61
                h115.271c8.477,0,15.584-4.813,15.873-10.611l3.295-66.024C236.888,205.057,231.474,201.822,224.595,201.822z"/>
            <path d="M379.204,201.821l-93.574,0.001c-6.879,0-12.293,3.236-12.092,7.307l3.293,66.024c0.291,5.798,7.4,10.611,15.873,10.611
                h115.275c8.473,0,13.525-4.813,11.338-10.611l-24.902-66.024C392.879,205.057,386.081,201.821,379.204,201.821z"/>
            <path d="M419.61,319.696H295.565c-9.117,0-16.227,5.703-15.865,12.927l6.236,125.035c0.586,11.742,10.93,21.594,23.078,21.594
                h165.289c12.148,0,18.283-9.852,13.855-21.594l-47.164-125.035C438.272,325.398,428.727,319.696,419.61,319.696z"/>
            <path d="M214.657,319.696l-124.043,0.001c-9.121,0-18.662,5.702-21.387,12.926L22.065,457.657
                c-4.428,11.742,1.703,21.594,13.855,21.594h165.285c12.152,0,22.492-9.852,23.076-21.594l6.24-125.035
                C230.884,325.399,223.776,319.696,214.657,319.696z"/>
        </g>
        </svg>
                </a>
                <a href="#" class="tilt-less-control">
                    <svg version="1.1" class="icon-tilt-less" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="18px" height="18px" viewBox="0 0 511.625 511.627" enable-background="new 0 0 511.625 511.627"
             xml:space="preserve">
        <g>
            <path d="M210.81,37.038H55.599c-11.047,0-20,8.954-20,20v155.211c0,11.046,8.953,20,20,20H210.81c11.045,0,20-8.954,20-20V57.038
                C230.81,45.992,221.854,37.038,210.81,37.038z"/>
            <path d="M454.127,37.038H298.917c-11.047,0-20,8.954-20,20v155.211c0,11.046,8.953,20,20,20h155.211c11.045,0,20-8.954,20-20
                V57.038C474.127,45.992,465.172,37.038,454.127,37.038z"/>
            <path d="M454.127,280.369H298.917c-11.047,0-20,8.954-20,20V455.58c0,11.046,8.953,20,20,20h155.211c11.045,0,20-8.954,20-20
                V300.369C474.127,289.323,465.172,280.369,454.127,280.369z"/>
            <path d="M210.81,280.369H55.599c-11.047,0-20,8.954-20,20V455.58c0,11.046,8.953,20,20,20H210.81c11.045,0,20-8.954,20-20V300.369
                C230.81,289.323,221.854,280.369,210.81,280.369z"/>
        </g>
        </svg>
                </a>
            </div>
        </div>
        `).template().toString();

        if (this._type === "basic"){
			html = S(`
                <div class="map-controls ${this._classes}">
                    <div class="zoom-control control">
                        <a href="#" class="zoom-plus-control"><i class="fa fa-plus"></i></a>
                        <a href="#" class="zoom-minus-control"><i class="fa fa-minus"></i></a>
                    </div>
                </div>
        `).template().toString();
        }

        this._mapContainer.append(html);
    };

    // Intentionally not documented.
    setupInteraction() {
        //// Add the mouse listeners.
        this._mapContainer.find(".exaggerate-plus-control").on({
            "mousedown": this.handleMouseEvent.bind(this,this.handleExaggeratePlus),
            "mouseup": this.handleMouseEvent.bind(this,this.handleExaggeratePlus),
            "mouseleave": this.handleMouseEvent.bind(this,this.handleExaggeratePlus)});
		this._mapContainer.find(".exaggerate-minus-control").on({
            "mousedown": this.handleMouseEvent.bind(this,this.handleExaggerateMinus),
            "mouseup": this.handleMouseEvent.bind(this,this.handleExaggerateMinus),
            "mouseleave": this.handleMouseEvent.bind(this,this.handleExaggerateMinus)});
		this._mapContainer.find(".zoom-plus-control").on({
            "mousedown": this.handleMouseEvent.bind(this, this.handleZoomIn),
            "mouseup": this.handleMouseEvent.bind(this, this.handleZoomIn),
            "mouseleave": this.handleMouseEvent.bind(this, this.handleZoomIn)
        });
		this._mapContainer.find(".zoom-minus-control").on({
            "mousedown": this.handleMouseEvent.bind(this, this.handleZoomOut),
            "mouseup": this.handleMouseEvent.bind(this, this.handleZoomOut),
            "mouseleave": this.handleMouseEvent.bind(this, this.handleZoomOut)
        });
		this._mapContainer.find(".tilt-less-control").on({
            "mousedown": this.handleMouseEvent.bind(this, this.handleTiltUp),
            "mouseup": this.handleMouseEvent.bind(this, this.handleTiltUp),
            "mouseleave": this.handleMouseEvent.bind(this, this.handleTiltUp)
        });
		this._mapContainer.find(".tilt-more-control").on({
            "mousedown": this.handleMouseEvent.bind(this, this.handleTiltDown),
            "mouseup": this.handleMouseEvent.bind(this, this.handleTiltDown),
            "mouseleave": this.handleMouseEvent.bind(this, this.handleTiltDown)
        });
		this._mapContainer.find(".rotate-right-control").on({
            "mousedown": this.handleMouseEvent.bind(this, this.handleHeadingRight),
            "mouseup": this.handleMouseEvent.bind(this, this.handleHeadingRight),
            "mouseleave": this.handleMouseEvent.bind(this, this.handleHeadingRight)
        });
		this._mapContainer.find(".rotate-left-control").on({
            "mousedown": this.handleMouseEvent.bind(this, this.handleHeadingLeft),
            "mouseup": this.handleMouseEvent.bind(this, this.handleHeadingLeft),
            "mouseleave": this.handleMouseEvent.bind(this, this.handleHeadingLeft)
        });
		this._mapContainer.find(".rotate-needle-control").on({
            "mouseup": this.handleHeadingReset.bind(this)
        });
        this.wwd.addEventListener("mousemove", this.handleManualRedraw.bind(this));
    };

    handleMouseEvent(operation, e) {
        if (
            e.type &&
            (
                (e.type === "mouseup" && e.which === 1) ||
                e.type === "mouseleave" ||
                e.type === "touchend" ||
                e.type === "touchcancel"
            )
        ) {
            this.handleOperationEnd(e);
        } else {
            this.handleOperationStart(operation, e);
        }
    };

    handleOperationStart(operation, e) {
        if ((e.type === "mousedown" && e.which === 1) || (e.type === "touchstart")) {

            this.activeOperation = operation;
            e.preventDefault();

            let self = this;
            let runOperation = function() {
                if (self.activeOperation) {
                    operation.call(self);
                    setTimeout(runOperation, 50);
                }
            };
            setTimeout(runOperation, 50);
        }
    };

    handleOperationEnd(e) {
        this.activeOperation = null;
        e.preventDefault();
    };

    handleExaggeratePlus() {
        var self = this;
        this.wwds.forEach(function(wwd){
            wwd.verticalExaggeration += self.exaggerationIncrement;
            wwd.redraw();
        });
    }

    handleExaggerateMinus() {
        var self = this;
        this.wwds.forEach(function(wwd){
            wwd.verticalExaggeration = Math.max(1, wwd.verticalExaggeration - self.exaggerationIncrement);
            wwd.redraw();
        });
    }

    handleZoomIn() {
        let self = this;
        this.wwds.forEach(function (wwd) {
            wwd.navigator.range *= (1 - self.zoomIncrement);
            wwd.redraw();
        });
    };

    handleZoomOut() {
        let self = this;
        this.wwds.forEach(function (wwd) {
            wwd.navigator.range *= (1 + self.zoomIncrement);
            wwd.redraw();
        });
    };

    handleHeadingRight() {
        let self = this;
        this.wwds.forEach(function (wwd) {
            wwd.navigator.heading -= self.headingIncrement;
            wwd.redraw();
        });
        this.redrawHeadingIndicator();
    };

    handleHeadingLeft() {
        let self = this;
        this.wwds.forEach(function (wwd) {
            wwd.navigator.heading += self.headingIncrement;
            wwd.redraw();
        });
        this.redrawHeadingIndicator();
    };

    handleHeadingReset() {
        let self = this;
        this.wwds.forEach(function (wwd) {
            let headingIncrement = 1.0;
            if (Math.abs(wwd.navigator.heading) > 60) {
                headingIncrement = 2.0;
            } else if (Math.abs(navigator.heading) > 120) {
                headingIncrement = 3.0;
            }
            if (wwd.navigator.heading > 0) {
                headingIncrement = -headingIncrement;
            }

            let runOperation = function() {
                if (Math.abs(wwd.navigator.heading) > Math.abs(headingIncrement)) {
                    wwd.navigator.heading += headingIncrement;
                    wwd.redraw();
                    self.redrawHeadingIndicator();
                    setTimeout(runOperation, 10);
                } else {
                    wwd.navigator.heading = 0;
                    wwd.redraw();
                    self.redrawHeadingIndicator();
                }
            };
            setTimeout(runOperation, 10);
        });
    };

    redrawHeadingIndicator() {
        let self = this;
        this.wwds.forEach(function (wwd) {
            let initialAngle = 45;
            let currentHeading = wwd.navigator.heading;
            let rotateAngle = 0 - currentHeading - initialAngle;
			self._mapContainer.find(".rotate-needle-control").find('i').css('transform', 'rotate(' + rotateAngle + 'deg)');
        });
    };

    handleTiltUp() {
        let self = this;
        this.wwds.forEach(function (wwd) {
            wwd.navigator.tilt =
                Math.max(0, wwd.navigator.tilt - self.tiltIncrement);
            wwd.redraw();
        });
    };

    handleTiltDown() {
        let self = this;
        this.wwds.forEach(function (wwd) {
            wwd.navigator.tilt =
                Math.min(90, wwd.navigator.tilt + self.tiltIncrement);
            wwd.redraw();
        });
    };

    handleManualRedraw(e) {
        let self = this;
        this.wwds.forEach(function (wwd) {
            if (e.which) { //we only care if mouse button is down todo will this work for touch?

                // redraw heading indicator
                self._lastHeading = self._lastHeading || 0;
                if (wwd.navigator.heading !== self._lastHeading) {
                    self.redrawHeadingIndicator();
                }
                self._lastHeading = wwd.navigator.heading;
            }
        });
    };
}

export default Controls;