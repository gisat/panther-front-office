import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import Button from "../../../../components/common/atoms/Button";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import MapSetPresentation, {PresentationMap} from "../../../../components/common/maps/MapSet/presentation";
import MapControlsPresentation from "../../../../components/common/maps/controls/MapControls/presentation";
import MapSet from "../../../../components/common/maps/MapSet";
import SzifCaseFooter from "../SzifCaseFooter";
import SzifCaseHeader from "../SzifCaseHeader/index";

class SzifMapView extends React.PureComponent {
	static propTypes = {
		activeMapKey: PropTypes.string,
		backgroundLayer: PropTypes.object,
		maps: PropTypes.array,
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func,
		view: PropTypes.object,
	};

	constructor(props) {
		super(props);
	}

	renderMaps() {
		const {maps} = this.props; 
		return maps.map((map) => {
			return <PresentationMap
					key={map.key}
					mapKey={map.key}
					layers={map.layers}
					/>
		})
	}
	render() {
		const {activeMapKey, backgroundLayer, view} = this.props;
		const maps = this.renderMaps();
		return (
			<div className="szifLpisZmenovaRizeni-map-view">
				<SzifCaseHeader switchScreen={this.props.switchScreen}/>
				<div style={{display: 'flex',height: '100%',flexFlow: 'column'}}>
					{/* <MapSet
						stateMapSetKey="szifLpisZmenovaRizeni-map-set"
						mapComponent={WorldWindMap}
					>
					</MapSet> */}
					<MapSetPresentation
						activeMapKey={activeMapKey}
						mapComponent={WorldWindMap}
						view={view}
						sync={{
							boxRange: true,
							center: true
						}}
						backgroundLayer={backgroundLayer}
					>	
						{maps}
						<MapControlsPresentation zoomOnly/>
					</MapSetPresentation>
					<SzifCaseFooter />
				</div>
			</div>
		);
	}
}

export default SzifMapView;
