

import WorldWindWidgetPanel from './WorldWindWidgetPanel';
import _ from "underscore";

let Stores = window.Stores;

/**
 * Class representing Thematic Layers Panel of WorldWindWidget
 * @param options {Object}
 * @constructor
 */
let $ = window.$;
class ThematicLayersPanel extends WorldWindWidgetPanel {
    constructor(options) {
        super(options);
        this._groupId = "thematic-layers";
        this._layersControls = [];

        window.Stores.addListener(this.onEvent.bind(this));
    };

	addCheckboxOnClickListener() {
		this._panelBodySelector.on("click", ".checkbox-row", this.switchLayer.bind(this));
	};

    rebuild(event){
    }

    rebuildControls(choropleths){
    	this._choropleths = choropleths;
        this.clear(this._groupId);

        if (!choropleths || choropleths.length === 0){
			this.displayPanel("none");
			return;
        } else {
            choropleths.forEach((choropleth => {
				let id = `choropleth_attr_${choropleth.attr}_as_${choropleth.as}`;
                let name = choropleth.name;
				if (name.length === 0) {
				    name = choropleth.attrName + " - " + choropleth.asName;
				}
				this.buildLayerControlRow(this._panelBodySelector, id, name);
            }));
			this.displayPanel("block");
        }
    };

    switchLayer(event){
		let self = this;

		setTimeout(function(){
			let checkbox = $(event.currentTarget);
			let layerId = checkbox.attr("data-id");

			if (checkbox.hasClass("checked")){
				window.Stores.notify("choropleths#addActive", layerId);
			} else {
				window.Stores.notify("choropleths#removeActive", layerId);
			}
		},50);
    }

    isControlActive(id){
		let state = this._stateStore.current().activeChoroplethKeys;
		if (state){
			return !!_.includes(state, id);
		} else {
			return false;
		}
	}

	/**
	 * @param type {string}
	 * @param options {Object}
	 */
	onEvent (type, options) {
	    if (type === "choropleths#reconfigured"){
	        this.rebuildControls(options);
        } else if (type === "place#setActivePlace"){
	    	this.rebuildControls(this._choropleths);
		} else if (type === "CHOROPLETH_CHECK_CHANGED"){
	    	if (options && options.added) {
				options.added.forEach(key => {
					let checkboxSelector = $('#checkbox-' + key);
					if (!checkboxSelector.hasClass('checked')){
						checkboxSelector.addClass('checked');
					}
				});
			}

	    	if (options && options.removed) {
				options.removed.forEach(key => {
					let checkboxSelector = $('#checkbox-' + key);
					if (checkboxSelector.hasClass('checked')){
						checkboxSelector.removeClass('checked');
					}
				});
			}
		}
    }
}

export default ThematicLayersPanel;