import LayerTool from '../LayerTool';

let polyglot = window.polyglot;

/**
 * @param options {Object}
 * @param options.id {string} Id of the tool
 * @param options.name {string} Name of the tool
 * @param options.target {Object} JQuery selector of target element
 * @param options.layers {Array} List of layers associated with this legend
 * @augments LayerTool
 * @constructor
 */
class LayerDownload extends LayerTool {
	constructor(options) {
		super(options);

		this._target = options.target;
		this._layers = options.layers;
		this._name = options.name;
		this._id = options.id;

		this.build();
	};

	/**
	 * Build an opacity control - icon and floater. Attach listeners.
	 */
	build() {
		this._icon = this.buildIcon(polyglot.t("download"), "download-icon", "download");
		this._iconSelector = this._icon.getElement();
		this.addEventsListener();
	};

	addEventsListener(){
		this._iconSelector.off("click").on("click", this.download.bind(this));
	};

	download(){
		window.open(this._layers[0].source_url, '_blank');
	}
}

export default LayerDownload;