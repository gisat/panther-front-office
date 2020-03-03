import React from 'react';
import {WorldWindMap, MapControls, MapSet} from "@gisatcz/ptr-maps";
import {Action} from '@gisatcz/ptr-state';
import ControlPanel from "./ControlPanel";

import './style.scss';
import {connects} from '@gisatcz/ptr-state';
const ConnectedMapSet = connects.MapSet(MapSet);

class MapConnectedToState extends React.PureComponent {
	constructor(props){
		super(props);
	}

	componentDidMount() {
		populateStores(this.props.store);
	}

	render() {
		return (
			<div className="demo-map-store-app ptr-light">
				<div className="demo-map-store-map">
					<ConnectedMapSet
						mapSetKey="xyz-map-set"
						mapComponent={WorldWindMap}
					>
						<MapControls/>
					</ConnectedMapSet>
				</div>
				<ControlPanel
					mapSetKey='xyz-map-set'
				/>
			</div>
		);
	}
}

export default MapConnectedToState;

function populateStores(store) {

	/* ===== Add map set and maps ===== */
	store.dispatch(Action.maps.addSet({
		key: 'xyz-map-set',
		data: {
			backgroundLayer: {
				layerTemplateKey: 'xyz-layer-template-0'
			},
			view: {
				boxRange: 50000
			},
			layers: [{
				key: 'xyz-layer-1',
				layerTemplateKey: 'xyz-layer-template-1'
			}],
			filterByActive: {
				case: true
			}
		}
	}));

	store.dispatch(Action.maps.setSetSync('xyz-map-set', {boxRange: true}));

	store.dispatch(Action.maps.addMap({
		key: 'xyz-map-1',
		data: {
			view: {center: {lat: 50.1, lon: 14.5}}
		}
	}));

	store.dispatch(Action.maps.addMap({
		key: 'xyz-map-2',
		data: {
			view: {center: {lat: 49.75, lon: 13.3}},
		}
	}));

	store.dispatch(Action.maps.addMap({
		key: 'xyz-map-3',
		data: {
			view: {center: {lat: 49.2, lon: 16.6}},
		}
	}));

	store.dispatch(Action.maps.addMap({
		key: 'xyz-map-4',
		data: {
			view: {center: {lat: 49.85, lon: 18.3}},
		}
	}));

	store.dispatch(Action.maps.addMapToSet('xyz-map-set','xyz-map-1' ));
	store.dispatch(Action.maps.addMapToSet('xyz-map-set','xyz-map-2' ));
	store.dispatch(Action.maps.addMapToSet('xyz-map-set','xyz-map-3' ));
	store.dispatch(Action.maps.addMapToSet('xyz-map-set','xyz-map-4' ));



	/* ===== Add metadata ===== */
	store.dispatch(Action.layerTemplates.add([{
		key: 'xyz-layer-template-1',
		data: {name: 'Ortofoto'}
	}, {
		key: 'xyz-layer-template-2',
		data: {name: 'GUF'}
	}]));

	store.dispatch(Action.cases.add([{
		key: 'xyz-case-1',
		data: {name: 'Before'}
	}, {
		key: 'xyz-case-2',
		data: {name: 'After'}
	}]));



	/* ===== Set active metadata keys ===== */
	store.dispatch(Action.cases.setActiveKey('xyz-case-1'));



	/* ===== Add relations and data source for background ===== */
	store.dispatch(Action.spatialRelations.add([{
		key: 'xyz-relation-0',
		data: {
			layerTemplateKey: 'xyz-layer-template-0',
			spatialDataSourceKey: 'xyz-data-source-osm'
		}
	}]));

	store.dispatch(Action.spatialDataSources.add([{
		key: 'xyz-data-source-osm',
		data: {
			type: "wmts",
			urls: ["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"]
		}
	}]));


	/* ===== Add relations for layers ===== */
	store.dispatch(Action.spatialRelations.add([{
		key: 'xyz-relation-1',
		data: {
			layerTemplateKey: 'xyz-layer-template-1',
			caseKey: 'xyz-case-1',
			spatialDataSourceKey: 'xyz-data-source-guf'
		}
	}, {
		key: 'xyz-relation-2',
		data: {
			layerTemplateKey: 'xyz-layer-template-1',
			caseKey: 'xyz-case-2',
			spatialDataSourceKey: 'xyz-data-source-guf-density'
		}
	}, {
		key: 'xyz-relation-3',
		data: {
			layerTemplateKey: 'xyz-layer-template-3',
			caseKey: 'xyz-case-1',
			spatialDataSourceKey: 'xyz-data-source-ortofoto-2000'
		}
	}, {
		key: 'xyz-relation-4',
		data: {
			layerTemplateKey: 'xyz-layer-template-4',
			caseKey: 'xyz-case-2',
			spatialDataSourceKey: 'xyz-data-source-ortofoto-2010'
		}
	}]));



	/* ===== Add data sources for layers ===== */
	store.dispatch(Action.spatialDataSources.add([{
		key: 'xyz-data-source-guf',
		data: {
			type: "wms",
			layers: "GUF04",
			url: "https://utep.it4i.cz/geoserver/ESA_UTEP/wms"
		}
	}]));

	store.dispatch(Action.spatialDataSources.add([{
		key: 'xyz-data-source-guf-density',
		data: {
			type: "wms",
			layers: "GUF10_DenS",
			url: "https://utep.it4i.cz/geoserver/ESA_UTEP/wms"
		}
	}]));
}