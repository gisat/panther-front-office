

import WorldWindWidgetPanel from './WorldWindWidgetPanel';

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
        this.addListeners();

        this._choropleths = [];
        this._layersControls = [];
        this._groupId = "chartlayer";
    };


    addListeners() {
        Stores.listeners.push(this.rebuild.bind(this, "choropleths"));
        Stores.listeners.push(this.updateChoropleths.bind(this, "updateChoropleths"));
    };

    switchOnLayersFrom2D() {
        this.updateChoropleths("updateChoropleths", "updateChoropleths");
    };

    /**
     * Add checkboxes for current configuration
     * @param action {string}
     * @param notification {string}
     */
    rebuild(action, notification) {
        if (action === notification && notification === "choropleths") {
            this.clear(this._id);
            this._choropleths = Stores.choropleths;
            this._layersControls = [];
            if (this._choropleths.length > 0) {
                let self = this;
                this._choropleths.forEach(function (choropleth) {
                    let name = choropleth.name;
                    if (name.length === 0) {
                        name = choropleth.attrName + " - " + choropleth.asName;
                    }
                    let layer = {
                        id: "chartlayer-" + choropleth.as + "-" + choropleth.attr,
                        name: name
                    };
                    choropleth.layer = layer;
                    choropleth.control = self.addLayerControl(layer.id, layer.name, self._panelBodySelector, false);
                    self._layersControls.push(choropleth.control);
                });
                this.displayPanel("block");
            } else {
                this.displayPanel("none");
            }
        }
    };

    /**
     * Update data about choropleth layers
     * @param action
     * @param notification
     */
    updateChoropleths(action, notification) {
        let self = this;
        if (action === notification && notification === "updateChoropleths") {
            this.clearLayers(this._id);

            this._choropleths.forEach(function (choropleth) {
                if (choropleth.hasOwnProperty("data")) {
                    let layer = {
                        id: choropleth.layer.id,
                        name: choropleth.layer.name,
                        layer: choropleth.data.legendLayer,
                        sldId: choropleth.data.sldId,
                        path: choropleth.data.legendLayer,
                        opacity: 70
                    };
                    self._mapStore.getAll().forEach(function (map) {
                        map.layers.addChoroplethLayer(layer, self._id, false);
                    });

                    let toolsContainer = $("#layer-tool-box-" + layer.id);
                    toolsContainer.html('');
                    let toolBox = choropleth.control.getToolBox();
                    toolBox.addLegend(layer, self._mapStore.getAll());
                    toolBox.addOpacity(layer, self._mapStore.getAll());
                }
            });

            this.switchOnActiveLayers(this._groupId);
        }
    };
}

export default ThematicLayersPanel;