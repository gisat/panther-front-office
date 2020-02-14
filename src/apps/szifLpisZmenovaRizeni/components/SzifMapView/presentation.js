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
		onUnMount: PropTypes.func,
		view: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.onViewChange = this.onViewChange.bind(this);
	}

	componentWillUnmount() {
		const {onUnMount} = this.props;
		onUnMount();
	}

	renderMaps(activeMapKey) {
		const {maps} = this.props; 
		return maps.map((map) => {
			let label;
			if(map.layers && map.layers.length > 0){
				const layer = map.layers.find(l => l.type !== 'vector');
				label = layer && layer.title || map.label;
			} else {
				label = map.label;
			}
			return <PresentationMap
						key={map.key}
						mapKey={map.key}
						layers={map.layers}
						label={label}
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
				<SzifCaseHeader switchScreen={this.props.switchScreen}/>
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
						<MapControlsPresentation zoomOnly/>
					</MapSetPresentation>
					<SzifCaseFooter />
				</div>
			</div>
		);
	}
}

export default SzifMapView;
