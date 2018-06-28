import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import WorldWind from '@nasaworldwind/worldwind';
import GeoJSONParser from '../../../../worldwind/formats/geojson/GeoJSONParser';

import Layers from '../../../../view/worldWind/layers/Layers';
import Controls from '../../../../view/worldWind/controls/Controls';
import mapUtils from "../../../../utils/map";
import MyWmsLayer from '../../../../worldwind/layers/MyWmsLayer';

const {WorldWindow, Sector, Location, ClickRecognizer, RenderableLayer, ShapeAttributes, Color, Polygon, Position} = WorldWind;

class MapEditingWorldWindMap extends React.PureComponent {

	static propTypes = {
		activeBackgroundLayerKey: PropTypes.string,
		bbox: PropTypes.string,
		mapContainerClass: PropTypes.string,
		sourceLayer: PropTypes.object,
        polygons: PropTypes.array
	};

	constructor(props){
		super(props);
		this.canvasId = "world-wind-canvas-map-editing";
	}

	// Keep the information about the currently selected polygon and its current code.
	componentDidMount() {
        const wwd = new WorldWindow(this.canvasId);
        this.wwd = wwd;

        this.mapControls = new Controls({
            worldWindow: wwd,
            mapContainerClass: this.props.mapContainerClass
        });

        if (this.props.navigatorState) {
            this.setNavigator(this.props.navigatorState);
        }

        // TODO remove dependency on obsolete code
        this.layersControl = new Layers(wwd);
        if (this.props.activeBackgroundLayerKey) {
            this.changeBackgroundLayer(this.props.activeBackgroundLayerKey);
        }

        if(this.props.sourceLayer && this.props.sourceLayer.name) {
            this.reloadSourceLayer();
        }

        if(this.props.selectedFeatures) {
            this.redrawSelectedPolygons(this.props.selectedFeatures);
        }
        if(this.props.editedFeatures) {
            this.redrawEditedPolygons(this.props.editedFeatures, this.props.selectedFeatures);
        }

        const layerWithSelectedPolygons = new RenderableLayer('Selected polygons');
        this._layerWithSelectedPolygons = layerWithSelectedPolygons;
        wwd.addLayer(layerWithSelectedPolygons);

        const layerWithUpdatedPolygons = new RenderableLayer('Updated polygons');
        this._layerWithUpdatedPolygons = layerWithUpdatedPolygons;
        wwd.addLayer(layerWithUpdatedPolygons);

        const self = this;
        this._editedPolygon = null;

        this.loadLegend().then(legend => {
            // Add Click Recognizer to use for construction of WFS.
            const clickRecognizer = new ClickRecognizer(wwd.canvas, (event) => {
                let x = event._clientX;
                let y = event._clientY;

                const topLeft = wwd.pickTerrain(wwd.canvasCoordinates(x, y)).objects[0].position;
                const rightBottom = wwd.pickTerrain(wwd.canvasCoordinates(x + 1, y + 1)).objects[0].position;

							const bbox = [rightBottom.latitude,topLeft.longitude,topLeft.latitude,rightBottom.longitude]; //minLat, minLon, maxLat, maxLon

							this.props.selectFeatureForBbox(bbox);

                //const url = `http://192.168.2.205/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames=geonode:pucs_514f7a7552564ceebd269a8d334f1324&bbox=${rightBottom.latitude},${topLeft.longitude},${topLeft.latitude},${rightBottom.longitude}&outputFormat=application/json`;
								//
                //const parser = new GeoJSONParser(url);
                //let props = null;
                //parser.load(layer => {
                //    // Get last renderable and save it as a
                //    self._editedPolygon = layer.renderables[layer.renderables.length - 1];
                //    self._editedPolygon.props = props;
                //    // Test method
                //    setTimeout(() => {
                //        self._editedPolygon.props["CODE2012"] = "40000";
                //        self._editedPolygon.attributes.interiorColor = this.getTheColorForPolygon(legend, self._editedPolygon.props);
								//
                //        // Update the transactions.
                //        this.updatePolygon(self._editedPolygon);
								//
                //        wwd.redraw();
                //    }, 5000);
                //    wwd.redraw();
                //}, (geometry, properties) => {
                //    const configuration = {};
                //    props = properties;
								//
                //    const name = properties.name || properties.Name || properties.NAME;
                //    if (name) {
                //        configuration.name = name;
                //    }
								//
                //    if (geometry.isPointType() || geometry.isMultiPointType()) {
                //        configuration.attributes = this.defaultPlacemarkAttributes;
                //    } else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
                //        configuration.attributes = new ShapeAttributes();
                //    } else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
                //        configuration.attributes = new ShapeAttributes();
                //        // Get the legend and color.
                //        configuration.attributes.interiorColor = this.getTheColorForPolygon(legend, properties);
                //    }
								//
                //    return configuration
                //}, layerWithUpdatedPolygons);
            });
            clickRecognizer.enabled = true;
        });
    }

    updatePolygon(polygon) {
        const body = `<wfs:Transaction service="WFS" version="1.0.0"
                         xmlns:topp="http://www.openplans.org/topp"
                         xmlns:ogc="http://www.opengis.net/ogc"
                         xmlns:wfs="http://www.opengis.net/wfs">
            <wfs:Update typeName="geonode:pucs_514f7a7552564ceebd269a8d334f1324">
                <wfs:Property>
                    <wfs:Name>CODE2012</wfs:Name>
                    <wfs:Value>${polygon.props['CODE2012']}</wfs:Value>
                </wfs:Property>
                <ogc:Filter>
                    <ogc:FeatureId fid="${polygon.props['fid']}"/>
                </ogc:Filter>
            </wfs:Update>
        </wfs:Transaction>`;
        console.log(body);

        fetch('http://192.168.2.205/geoserver/wfs?service=WFS&version=1.1.0&request=Transaction', {
            body: body, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'text/xml'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        }).then(response => {
            console.log(response);
        });
    }

	async loadLegend() {
		// 23
		return Promise.resolve([
			{
				code: '11100',
				color: new Color(128 / 255, 0, 0, 1),
				text: '11100: Continuous Urban fabric (S.L. > 80%)'
			},
            {
                code: '11210',
                color: new Color(191 / 255, 0, 0, 1),
                text: '11210: Discontinuous Dense Urban Fabric (S.L.: 50% - 80%)'
            },
            {
                code: '11220',
                color: new Color(255 / 255, 64 / 255, 64 / 255, 1),
                text: ''
            },
            {
                code: '11230',
                color: new Color(255 / 255, 128 / 255, 128 / 255, 1),
                text: ''
            },
            {
                code: '11240',
                color: new Color(255 / 255, 191 / 255, 191 / 255, 1),
                text: ''
            },
            {
                code: '11300',
                color: new Color(204 / 255, 102 / 255, 102 / 255, 1),
                text: ''
            },
            {
                code: '12100',
                color: new Color(204 / 255, 77 / 255, 242 / 255, 1),
                text: ''
            },
            {
                code: '12210',
                color: new Color(149 / 255, 149 / 255, 149 / 255, 1),
                text: ''
            },
            {
                code: '12220',
                color: new Color(179 / 255, 179 / 255, 179 / 255, 1),
                text: ''
            },
            {
                code: '12230',
                color: new Color(89 / 255, 89 / 255, 89 / 255, 1),
                text: ''
            },
            {
                code: '12300',
                color: new Color(230 / 255, 204 / 255, 204 / 255, 1),
                text: ''
            },
            {
                code: '12400',
                color: new Color(230 / 255, 204 / 255, 230 / 255, 1),
                text: ''
            },
            {
                code: '13100',
                color: new Color(115 / 255, 77 / 255, 55 / 255, 1),
                text: ''
            },
            {
                code: '13300',
                color: new Color(185 / 255, 165 / 255, 110 / 255, 1),
                text: ''
            },
            {
                code: '13400',
                color: new Color(135 / 255, 69 / 255, 69 / 255, 1),
                text: ''
            },
            {
                code: '14100',
                color: new Color(140 / 255, 220 / 255, 0, 1),
                text: ''
            },
            {
                code: '14200',
                color: new Color(172 / 255, 210 / 255, 165 / 255, 1),
                text: ''
            },
            {
                code: '21000',
                color: new Color(255 / 255, 255 / 255, 168 / 255, 1),
                text: ''
            },
            {
                code: '22000',
                color: new Color(242 / 255, 166 / 255, 77 / 255, 1),
                text: ''
            },
            {
                code: '23000',
                color: new Color(230 / 255, 230 / 255, 77 / 255, 1),
                text: ''
            },
            {
                code: '24000',
                color: new Color(255 / 255, 230 / 255, 77 / 255, 1),
                text: ''
            },
            {
                code: '25000',
                color: new Color(242 / 255, 204 / 255, 128 / 255, 1),
                text: ''
            },
            {
                code: '31000',
                color: new Color(0, 140 / 255, 0, 1),
                text: ''
            },
            {
                code: '32000',
                color: new Color(204 / 255, 242 / 255, 77 / 255, 1),
                text: ''
            },
            {
                code: '33000',
                color: new Color(204 / 255, 255 / 255, 204 / 255, 1),
                text: ''
            },
            {
                code: '40000',
                color: new Color(166 / 255, 166 / 255, 255 / 255, 1),
                text: ''
            },
            {
                code: '50000',
                color: new Color(128 / 255, 242 / 255, 230 / 255, 1),
                text: ''
            }
		]);
	}

	getTheColorForPolygon(legend, properties) {
		const code = properties["CODE2012"];

		return legend.filter(legendItem => {
		    return legendItem.code == code;
        })[0].color;
	}


	componentWillReceiveProps(nextProps){
		if (_.isEmpty(this.props) || (nextProps.activeBackgroundLayerKey !== this.props.activeBackgroundLayerKey)){
			this.changeBackgroundLayer(nextProps.activeBackgroundLayerKey);
		}

		if (nextProps.navigatorState){
			this.setNavigator(nextProps.navigatorState);
		}

		//if(nextProps.polygons) {
		//    this.reloadSourceLayer();
		//    this.visualizeChangedPolygons(nextProps.polygons);
     //   }

		if(nextProps.selectedFeatures) {
			if(nextProps.sourceLayer && nextProps.sourceLayer.name) {
				this.reloadSourceLayer(nextProps);
			}
			this.redrawSelectedPolygons(nextProps.selectedFeatures);
		}
		if(nextProps.editedFeatures) {
			if(nextProps.sourceLayer && nextProps.sourceLayer.name) {
				this.reloadSourceLayer(nextProps);
			}
			this.redrawEditedPolygons(nextProps.editedFeatures, nextProps.selectedFeatures);
		}
	}

	componentDidUpdate(){
		if(this.props.sourceLayer && this.props.sourceLayer.name) {
			this.reloadSourceLayer();
		}
	}

	reloadSourceLayer(props) {
		props = props || this.props;
	    if(this.wwd) {
	        if(this.sourceLayer) {
	            this.wwd.removeLayer(this.sourceLayer);
            }

            this.sourceLayer = new MyWmsLayer({
                service: props.sourceLayer.url,
                layerNames: props.sourceLayer.name,
                sector: new Sector(-90, 90, -180, 180),
                levelZeroDelta: new Location(45, 45),
                numLevels: 14,
                format: "image/png",
                opacity: props.sourceLayer.opacity || 1,
                size: 256,
                version: "1.3.0",
                styleNames: props.sourceLayer.style || "urbanAtlas"
            });

            // Add WMS Layer
            this.wwd.addLayer(this.sourceLayer);
        }
    }

    visualizeChangedPolygons(polygons) {
	    let shapeAttributes = new ShapeAttributes();
	    if(this._layerWithUpdatedPolygons) {
            this._layerWithUpdatedPolygons.removeAllRenderables();
            this._layerWithUpdatedPolygons.addRenderables(polygons.map(polygon => {
                return new Polygon(polygon, shapeAttributes);
            }));
        }
    }

	redrawSelectedPolygons(selectedFeatures) {
		console.log('MapEditingWorldWindMap#redrawSelectedPolygons', selectedFeatures);
		let shapeAttributes = new ShapeAttributes();
		shapeAttributes.drawInterior = false;
		shapeAttributes.outlineColor = Color.CYAN;
		let polygons = this.featuresToPolygons(selectedFeatures, shapeAttributes);

		console.log('MapEditingWorldWindMap#redrawSelectedPolygons polygons', polygons, this._layerWithSelectedPolygons);
		if(this._layerWithSelectedPolygons) {
			this._layerWithSelectedPolygons.removeAllRenderables();
			this._layerWithSelectedPolygons.addRenderables(polygons);
		}
	}

	redrawEditedPolygons(editedFeatures, selectedFeatures) {
		//remove edited features that are also selected
		editedFeatures = _.reject(editedFeatures, feature => {
			return _.includes(_.map(selectedFeatures, 'key'), feature.key);
		});

		let shapeAttributes = new ShapeAttributes();
		shapeAttributes.drawInterior = false;
		shapeAttributes.outlineColor = Color.BLACK;
		let polygons = this.featuresToPolygons(editedFeatures, shapeAttributes);
		if(this._layerWithSelectedPolygons) {
			this._layerWithSelectedPolygons.removeAllRenderables();
			this._layerWithSelectedPolygons.addRenderables(polygons);
		}
	}

	featuresToPolygons(features, shapeAttributes) {
		return _.map(features, feature => {
			let coordinates = feature.data.geometry.type === "MultiPolygon" ? feature.data.geometry.coordinates[0] : [feature.data.geometry.coordinates[0]];
			return new Polygon(_.map(coordinates, simplePolygon => {
				return _.map(simplePolygon, point => {
					return new Position(point[1], point[0]);
				});
			}), shapeAttributes);
		});
	}

	changeBackgroundLayer(key){
		if (key){
			this.layersControl.removeAllLayersFromGroup('background-layers');
			this.layersControl.addBackgroundLayer(key, 'background-layers');
			this.wwd.redraw();
		}
	}

	setNavigator(navigatorState){
        const wwd = this.wwd,
			navigator = this.wwd.navigator;
        navigator.lookAtLocation = navigatorState.lookAtLocation;
        navigator.range = navigatorState.range;
        wwd.redraw();
	}

	render() {
		return (
			<div className="world-wind-container">
				<canvas className="world-wind-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);
	}
}

export default MapEditingWorldWindMap;
