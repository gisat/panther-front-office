import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import Button from "../../../../components/common/atoms/Button";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import MapSetPresentation, {PresentationMap} from "../../../../components/common/maps/MapSet/presentation";
import MapControlsPresentation from "../../../../components/common/maps/controls/MapControls/presentation";
import MapSet from "../../../../components/common/maps/MapSet";
import SzifExplorerFooter from "../SzifExplorerFooter";
import SzifExplorerHeader from "../SzifExplorerHeader";
import MapWrapper from "./MapWrapper";

class SzifMapView extends React.PureComponent {
	static propTypes = {
		activeMapKey: PropTypes.string,
		backgroundLayer: PropTypes.object,
		maps: PropTypes.array,
		mapSetKey: PropTypes.string,
		onViewChange: PropTypes.func,
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func,
		setActiveMapKey: PropTypes.func,
		view: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.onViewChange = this.onViewChange.bind(this);
	}

	renderMaps(activeMapKey) {
		const {maps} = this.props; 
		return maps.map((map) => {
			return <PresentationMap
						key={map.key}
						mapKey={map.key}
						layers={map.layers}
						label={map.label}
						/>
		})
	}

	onViewChange(view) {
		const {onViewChange, mapSetKey} = this.props;
		onViewChange(mapSetKey, view);
	}
	render() {
		const {activeMapKey, backgroundLayer, view, setActiveMapKey, mapSetKey} = this.props;
		const maps = this.renderMaps(activeMapKey);
		return (
			<div className="szifLpisZmenovaRizeni-map-view">
				<SzifExplorerHeader switchScreen={this.props.switchScreen}/>
				<div style={{display: 'flex',height: '100%',flexFlow: 'column'}}>
					<MapSetPresentation
						customMapWrapper={MapWrapper}
						onMapClick={(mapKey, view) => setActiveMapKey(mapSetKey, mapKey, view)}
						activeMapKey={activeMapKey}
						mapComponent={WorldWindMap}
						view={view}
						sync={{
							boxRange: true,
							center: true
						}}
						backgroundLayer={backgroundLayer}
						onViewChange={this.onViewChange}
					>	
						{maps}
						<MapControlsPresentation zoomOnly updateView={this.onViewChange}/>
					</MapSetPresentation>
					<SzifExplorerFooter />
				</div>
			</div>
		);
	}
}

export default SzifMapView;
