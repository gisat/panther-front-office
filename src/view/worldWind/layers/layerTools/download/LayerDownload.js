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
		let self = this;
		this._iconSelector.off("click").on("click", self.download);
	};

	download(){
		// todo to download layers are in this._layers
	}
}

export default LayerDownload;