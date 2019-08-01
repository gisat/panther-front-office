import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import WorldWind from '@nasaworldwind/worldwind';
import GeoJSONParser from '../../../../worldwind/formats/geojson/GeoJSONParser';
import utils from '../../../../utils/utils';

import Layers from '../../../../view/worldWind/layers/Layers';
import Controls from '../../../../view/worldWind/controls/Controls';
import mapUtils from "../../../../utils/map";
import MyWmsLayer from '../../../../worldwind/layers/MyWmsLayer';

const {WorldWindow, Sector, Location, ClickRecognizer, RenderableLayer, ShapeAttributes, Color, SurfacePolygon, Position} = WorldWind;

class MapEditingWorldWindMap extends React.PureComponent {

    static propTypes = {
        activeBackgroundLayerKey: PropTypes.string,
        bbox: PropTypes.string,
        mapContainerClass: PropTypes.string,
        sourceLayer: PropTypes.object,
        polygons: PropTypes.array,
        editedPolygonsInfo: PropTypes.string,
		selectFeatureForPoint: PropTypes.func
    };

    constructor(props) {
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

        if (this.props.sourceLayer && this.props.sourceLayer.name) {
            this.reloadSourceLayer();
        }

        if (this.props.selectedFeatures) {
            this.redrawSelectedPolygons(this.props.selectedFeatures);
        }
        if (this.props.editedFeatures) {
            this.redrawEditedPolygons(this.props.editedFeatures, this.props.selectedFeatures);
        }

        const layerWithSelectedPolygons = new RenderableLayer('Selected polygons');
        this._layerWithSelectedPolygons = layerWithSelectedPolygons;
        wwd.addLayer(layerWithSelectedPolygons);
        const layerWithEditedPolygons = new RenderableLayer('Edited polygons');
        this._layerWithEditedPolygons = layerWithEditedPolygons;
        wwd.addLayer(layerWithEditedPolygons);

        // Add Click Recognizer to use for construction of WFS.
        const clickRecognizer = new ClickRecognizer(wwd.canvas, (event) => {
            let x = event._clientX;
            let y = event._clientY;

            const topLeft = wwd.pickTerrain(wwd.canvasCoordinates(x, y)).objects[0].position;
            const rightBottom = wwd.pickTerrain(wwd.canvasCoordinates(x + 1, y + 1)).objects[0].position;

            const bbox = [rightBottom.latitude, topLeft.longitude, topLeft.latitude, rightBottom.longitude]; //minLat, minLon, maxLat, maxLon

            // this.props.selectFeatureForBbox(bbox);
            this.props.selectFeatureForPoint(topLeft);
        });
        clickRecognizer.enabled = true;
    }

    componentWillReceiveProps(nextProps) {
        if (_.isEmpty(this.props) || (nextProps.activeBackgroundLayerKey !== this.props.activeBackgroundLayerKey)) {
            this.changeBackgroundLayer(nextProps.activeBackgroundLayerKey);
        }

        if (nextProps.navigatorState && (JSON.stringify(nextProps.navigatorState) !== JSON.stringify(this.props.navigatorState))) {
            this.setNavigator(nextProps.navigatorState);
        }
        if (nextProps.sourceLayer && nextProps.sourceLayer.opacity) {
            this.setLayerOpacity(nextProps.sourceLayer.opacity);
        }

        if (nextProps.selectedFeatures) {
            this.redrawSelectedPolygons(nextProps.selectedFeatures);
        }
        if (nextProps.editedFeatures) {
            this.redrawEditedPolygons(nextProps.editedFeatures, nextProps.selectedFeatures);
        }

        if (nextProps.editedPolygonsInfo && nextProps.editedPolygonsInfo !== this.props.editedPolygonsInfo) {
            this.reloadSourceLayer(this.props);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.sourceLayer && this.props.sourceLayer.name && (!prevProps.sourceLayer || this.props.sourceLayer.name !== prevProps.sourceLayer.name)) {
            this.reloadSourceLayer();
        }
    }

    reloadSourceLayer(props) {
        props = props || this.props;
        if (this.wwd) {
            if (this.sourceLayer) {
                this.wwd.removeLayer(this.sourceLayer);
                this.wwd.redraw();
            }

            let style = props.sourceLayer.style;

            /* Hack for PUCS */
            let pucsConfig = props.scope && props.scope.data && props.scope.data.configuration && props.scope.data.configuration.pucsLandUseScenarios;

            if (pucsConfig && this.props.placeKey) {
                let templateKey = pucsConfig.templates.sourceVector;
                let styleObject = _.find(pucsConfig.styles, {'placeKey': this.props.placeKey, 'layerTemplateKey': templateKey});
                if (styleObject) {
                    style = styleObject.styleId;
                }
            }

            this.sourceLayer = new MyWmsLayer({
                name: 'Polygons ' + utils.guid(),
                service: props.sourceLayer.url,
                layerNames: props.sourceLayer.name,
                sector: new Sector(-90, 90, -180, 180),
                levelZeroDelta: new Location(45, 45),
                numLevels: 14,
                format: "image/png",
                opacity: (props.sourceLayer.opacity / 100) || 1,
                size: 256,
                version: "1.3.0",
                styleNames: style,
                customParams: {
                    time: moment(new Date().toString()).utc().format()
                }
            });

            this.wwd.addLayer(this.sourceLayer);
            this.wwd.redraw();
        }
    }

    redrawSelectedPolygons(selectedFeatures) {
        console.log('MapEditingWorldWindMap#redrawSelectedPolygons', selectedFeatures);
        let shapeAttributes = new ShapeAttributes();
        shapeAttributes.drawInterior = false;
        shapeAttributes.outlineColor = Color.CYAN;
        shapeAttributes.outlineWidth = 3;
        let polygons = this.featuresToPolygons(selectedFeatures, shapeAttributes);

        console.log('MapEditingWorldWindMap#redrawSelectedPolygons polygons', polygons, this._layerWithSelectedPolygons);
        if (this._layerWithSelectedPolygons) {
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
        shapeAttributes.outlineWidth = 3;
        let polygons = this.featuresToPolygons(editedFeatures, shapeAttributes);
        if (this._layerWithEditedPolygons) {
            this._layerWithEditedPolygons.removeAllRenderables();
            this._layerWithEditedPolygons.addRenderables(polygons);
        }
    }

    featuresToPolygons(features, shapeAttributes) {
        return _.map(features, feature => {
            let coordinates = feature.data.geometry.type === "MultiPolygon" ? feature.data.geometry.coordinates[0] : [feature.data.geometry.coordinates[0]];
            return new SurfacePolygon(_.map(coordinates, simplePolygon => {
                return _.map(simplePolygon, point => {
                    return new Position(point[1], point[0]);
                });
            }), shapeAttributes);
        });
    }

    changeBackgroundLayer(key) {
        if (key) {
            this.layersControl.removeAllLayersFromGroup('background-layers');
            this.layersControl.addBackgroundLayer(key, 'background-layers');
            this.wwd.redraw();
        }
    }

    setNavigator(navigatorState) {
        const wwd = this.wwd,
            navigator = this.wwd.navigator;
        navigator.lookAtLocation = navigatorState.lookAtLocation;
        navigator.range = navigatorState.range;
        wwd.redraw();
    }

    setLayerOpacity(opacity) {
        if (this.sourceLayer) {
            this.sourceLayer.opacity = opacity / 100;
            this.wwd.redraw();
        }
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
