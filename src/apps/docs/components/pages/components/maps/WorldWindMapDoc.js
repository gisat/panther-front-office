import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import layersHelper from '../../../../../../components/common/maps/Deprecated_WorldWindMap/layers/helpers';
import WorldWindMap from "../../../../../../components/common/maps/Deprecated_WorldWindMap/presentation";
import Page from '../../../Page';

class WorldWinMapDoc extends React.PureComponent {
	constructor() {
		super();
		this.state = {};

		this.state.navigator = {
			lookAtLocation: {
				latitude: 14,
				longitude: 103
			},
			range: 1500000,
			roll: 0,
			tilt: 0,
			heading: 0
		}

		this.state.layers = [];
		const backgroundLayer = layersHelper.addLayer([], {type:'wikimedia'}, 0);
		const layers = [layersHelper.getLayerByType({
			key: 'wms1',
			layers: 'geonode:SE_Asia_WSF_Evolution_1995',
			name: '',
			url:'https://urban-tep.eu/puma/geoserver/gwc/service/wms',
			styles: '',
			version: '1.1.0',
		}, 'wms')];
		this.state.layers = [...backgroundLayer, ...layers];
	}
	render() {
		return (
			<Page title="WebWorldWind map">
				<h2>
					Basic map with WMS layer
				</h2>
				<div style={{height:'500px'}}>
					<WorldWindMap 
						navigator={this.state.navigator}
						layers={this.state.layers}
						elevationModel={null}
					/>
				</div>
			</Page>
		)
	}
}

export default withNamespaces()(WorldWinMapDoc);