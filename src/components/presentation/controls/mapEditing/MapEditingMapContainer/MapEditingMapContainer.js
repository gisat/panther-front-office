import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import MapEditingWorldWindMap from '../../../maps/MapEditingWorldWindMap/MapEditingWorldWindMap';
import MapEditingTools from '../MapEditingTools/MapEditingTools';

import Loader from '../../../atoms/Loader/Loader'

import './MapEditingMapContainer.css';

class MapEditingMapContainer extends React.PureComponent {

	static propTypes = {
		closeConfirmMessage: PropTypes.string,
		onCloseOverlay: PropTypes.func,
		onCloseEditing: PropTypes.func,
		activeBackgroundLayerKey: PropTypes.string,
		setLayerOpacity: PropTypes.func,
		mapData: PropTypes.object,
		sourceLayer: PropTypes.object,
		editedPolygonsInfo: PropTypes.string,
		selectFeatureForPoint: PropTypes.func,
		placeKey: PropTypes.number,
		scope: PropTypes.object
	};

	constructor(props){
		super(props);
		this.onClose = this.onClose.bind(this);
	}

	onClose(){
		if (this.props.closeConfirmMessage){
			if (window.confirm(this.props.closeConfirmMessage)) {
				this.props.onCloseEditing();
				this.props.onCloseOverlay();
			}
		} else {
			this.props.onCloseEditing();
			this.props.onCloseEditing();
		}
	}

	render() {
		let mapContainerClass = "ptr-editing-map-container";

		return (
			<div className={mapContainerClass}>
				<MapEditingWorldWindMap
					activeBackgroundLayerKey={this.props.activeBackgroundLayerKey}
					mapContainerClass={mapContainerClass}
					navigatorState={this.props.navigatorState}
					selectFeatureForBbox={this.props.selectFeatureForBbox}
					sourceLayer={this.props.sourceLayer}
					editedFeatures={this.props.editedFeatures}
					selectedFeatures={this.props.selectedFeatures}
					editedPolygonsInfo={this.props.editedPolygonsInfo}
					selectFeatureForPoint={this.props.selectFeatureForPoint}
					placeKey={this.props.placeKey}
					scope={this.props.scope}
				/>
				<MapEditingTools
					onCloseClick={this.onClose}
					opacity={this.props.mapData ? this.props.mapData.layerOpacity : null}
					setOpacity={this.props.setLayerOpacity}
				/>
				{this.props.mapData && this.props.mapData.layerLoading ? (
					<div className="ptr-editing-map-loader">
						<Loader
							transparent
							progress={this.props.mapData.layerLoadingProgress}
						/>
					</div>
				): null}
			</div>
		);
	}
}

export default MapEditingMapContainer;
