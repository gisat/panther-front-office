/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Logger.js 3418 2015-08-22 00:17:05Z tgaskins $
 */
define(function () {
    "use strict";
    /**
     * Logs selected message types to the console.
     * @exports Logger
     */

    var Logger = {
        /**
         * Log no messages.
         * @constant
         */
        LEVEL_NONE: 0,
        /**
         * Log messages marked as severe.
         * @constant
         */
        LEVEL_SEVERE: 1,
        /**
         * Log messages marked as warnings and messages marked as severe.
         * @constant
         */
        LEVEL_WARNING: 2,
        /**
         * Log messages marked as information, messages marked as warnings and messages marked as severe.
         * @constant
         */
        LEVEL_INFO: 3,

        /**
         * Set the logging level used by subsequent invocations of the logger.
         * @param {Number} level The logging level, one of Logger.LEVEL_NONE, Logger.LEVEL_SEVERE, Logger.LEVEL_WARNING,
         * or Logger.LEVEL_INFO.
         */
        setLoggingLevel: function (level) {
            loggingLevel = level;
        },

        /**
         * Indicates the current logging level.
         * @returns {Number} The current logging level.
         */
        getLoggingLevel: function () {
            return loggingLevel;
        },

        /**
         * Logs a specified message at a specified level.
         * @param {Number} level The logging level of the message. If the current logging level allows this message to be
         * logged it is written to the console.
         * @param {String} message The message to log. Nothing is logged if the message is null or undefined.
         */
        log: function (level, message) {
            if (message && level > 0 && level <= loggingLevel) {
                if (level === Logger.LEVEL_SEVERE) {
                    console.error(message);
                } else if (level === Logger.LEVEL_WARNING) {
                    console.warn(message);
                } else if (level === Logger.LEVEL_INFO) {
                    console.info(message);
                } else {
                    console.log(message);
                }
            }
        },

        // Intentionally not documented.
        makeMessage: function (className, functionName, message) {
            var msg = this.messageTable[message] ? this.messageTable[message] : message;

            return className + "." + functionName + ": " + msg;
        },

        // Intentionally not documented.
        logMessage: function (level, className, functionName, message) {
            var msg = this.makeMessage(className, functionName, message);
            this.log(level, msg);

            return msg;
        },

        messageTable: {
            emptyResult: "Result is empty!",
            missingAreaTemplate: "Area Template parameter is null or undefined!",
            missingBoxId: "Box ID of an element is null or undefined!",
            missingBoxName: "Box name is null or undefined!",
			missingDContent: "Content is null or undefined!",
            missingData: "Data id null, undefined or empty!",
            missingDataset: "Dataset parameter is null or undefined!",
            missingEndpointUrl: "Endpoint url is null or undefined!",
            missingElementId: "Required ID of an element is null or undefined!",
            missingFilter: "Instance of Filter is missing!",
            missingHistogramMinimum: "Minimum is null or undefined!",
            missingHistogramMaximum: "Maximum is null or undefined!",
            missingHTMLElement: "Required HTML element wasn't found!",
            missingId: "Id is null or undefined!",
            missingInputs: "Inputs parameter is null or undefined!",
            missingLayer: "Layer parameter is null or undefined!",
            missingName: "Name property is missing, null or undefined!",
			missingMap: "Map property is missing, null or undefined!",
			missingMapsContainer: "Maps container is missing, null or undefined!",
            missingNumClasses: "NumClasses is null or undefined!",
            missingOptions: "Options parameter is null or undefined",
            missingParameter: "One of parameters is null or undefined!",
            missingPlace: "Place is null or undefined!",
            missingPlaceholder: "Placeholder parameter is null or undefined!",
            missingSelections: "Data for selection boxes is missing",
            missingSliderRange: "Slider range is null, undefined or empty!",
            missingSliderType: "A type of slider is null or undefined!",
            missingSliderValues: "Slider default values parameter is null, undefined or empty!",
            missingTargetElementId: "Required target element ID is null or undefined!",
            missingTarget: "Target is null or undefined!",
            missingTheme: "Theme is null or undefined!",
			missingText: "Text is null or undefined!",
            missingWidgetId: "Widget Id is null or undefined!",
            missingWidgetName: "Widget Name is null or undefined!",
            missingWorldWind: "World Wind parameter is missing!",
            missingXml: "XML parameter is is null or undefined!",
            notNaturalNumber: "Parameter is not a natural number!"
        }
    };

    var loggingLevel = 4; // log severe messages by default

    return Logger;
});