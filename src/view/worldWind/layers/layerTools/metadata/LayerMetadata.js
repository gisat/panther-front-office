import LayerTool from '../LayerTool';

let polyglot = window.polyglot;


/**
 * Class representing layer metadata
 * @param options {Object}
 * @param options.id {string} Id of the tool
 * @param options.name {string} Name of the tool
 * @param options.class {string}
 * @param options.target {Object} JQuery selector of target element
 * @param options.layers {Array} List of layers associated with this metadata
 * @param options.style {Object} Associated style
 * @augments LayerTool
 * @constructor
 */
let $ = window.$;
class LayerMetadata extends LayerTool {
    constructor(options) {
        super(options);
        this._class = options.class;
        this._target = options.target;
        this._layers = options.layers;
        this._style = options.style;
        this._name = "Metadata";
        this._id = options.id;

        this.build();
    };

    /**
     * Build a metadata
     */
    build() {
        this._icon = this.buildIcon(polyglot.t("metadata"), "metadata-icon", "metadata");
        this._floater = this.buildFloater(polyglot.t("metadata"), "metadata-floater");

        this._iconSelector = this._icon.getElement();
        this._floaterSelector = this._floater.getElement();

        this.addEventsListener();
    };

    /**
     * Add content to a floater
     */
    addContent() {
        const content = this._layers.map(l => `${l.period.name}</br>${l.metadata}</br>`)
        this._floater.addContent(content);
    };
}

export default LayerMetadata
