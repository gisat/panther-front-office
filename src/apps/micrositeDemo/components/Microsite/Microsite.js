import React from 'react';
import PropTypes from "prop-types";

import './style.scss';
import WorldWindMap from "../../../../components/common/maps/Deprecated_WorldWindMap/presentationWithHandlers";

const polygonLayer = {
	key: "snezka_example_layer",
	type: "wms",
	layers: "geonode:snezka",
	opacity: 0.7,
	url: "http://192.168.2.206/geoserver/geonode/wms"
};

class Microsite extends React.PureComponent {
	static propTypes = {
	};

	render() {
		return (
			<div className="ptr-microsite ptr-light">
				<div className="ptr-microsite-hero">
					<div>
						<h1>Sněžka</h1>
					</div>
				</div>
				<div className="ptr-microsite-content">
					<h2>About</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					<div className="ptr-microsite-map">
						<WorldWindMap
							backgroundLayer={[{
								type: "wmts",
								urls: ['http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 'http://b.tile.openstreetmap.org/{z}/{x}/{y}.png', 'http://c.tile.openstreetmap.org/{z}/{x}/{y}.png']
							}]}
							layers={[polygonLayer]}
							elevationModel={null}
							navigator={{
								lookAtLocation: {
									latitude: 50.733,
									longitude: 15.732
								},
								range: 7000,
								roll: 0,
								tilt: 0,
								heading: 0
							}}
						/>
					</div>

					<h2>Aerial</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					<div className="ptr-microsite-map">
						<WorldWindMap
							backgroundLayer={[{
								type: "bingAerial"
							}]}
							layers={[polygonLayer]}
							elevationModel="default"
							navigator={{
								lookAtLocation: {
									latitude: 50.810,
									longitude: 15.732
								},
								range: 20000,
								roll: 0,
								tilt: 72,
								heading: -1.8,
								elevation: 2.5
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Microsite;