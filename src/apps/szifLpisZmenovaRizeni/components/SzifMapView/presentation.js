import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import Button from "../../../../components/common/atoms/Button";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import MapControlsPresentation from "../../../../components/common/maps/controls/MapControls/presentation";
import MapSet from "../../../../components/common/maps/MapSet";
import SzifCaseFooter from "../SzifCaseFooter";
import SzifCaseHeader from "../SzifCaseHeader/index";

class SzifMapView extends React.PureComponent {
	static propTypes = {
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="szifLpisZmenovaRizeni-map-view">
				{/* <div>
					<Button onClick={this.props.switchScreen}>Zpět</Button>
				</div> */}
				<SzifCaseHeader switchScreen={this.props.switchScreen}/>
				<div style={{display: 'flex',height: '100%',flexFlow: 'column'}}>
					<MapSet
						stateMapSetKey="szifLpisZmenovaRizeni-map-set"
						mapComponent={WorldWindMap}
					>
						<MapControlsPresentation zoomOnly/>
					</MapSet>
					<SzifCaseFooter />
				</div>
			</div>
		);
	}
}

export default SzifMapView;
