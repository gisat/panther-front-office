import React from "react";

import './style.scss';
import PresentationMapWithControls from "../../../../components/common/maps/PresentationMapWithControls";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import MapControls from "../../../../components/common/maps/MapControls/presentation";
import LeafletMap from "../../../../components/common/maps/LeafletMap/presentation";

const dhakaView = {
	center: {
		lat: 23.78,
		lon: 90.41
	},
	boxRange: 60035
};

const stamenLite = {
	key: 'stamen-lite',
	type: 'wmts',
	options: {
		url: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
	}
};

const osm = {
	key: 'osm',
	type: 'wmts',
	options: {url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
};


const Highlights = props => {

		return (
			<div className="scudeoCities-highlights">

				<h2>World wind map + LULC (VHR) - Level 1</h2>
				<div style={{height: 500}}>
					<PresentationMapWithControls
						map={
							<WorldWindMap
								backgroundLayer={stamenLite}
								layers={[
									{
										key: 'lulc-vhr-level-1',
										name: 'LULC (VHR) - Level 1',
										type: 'wms',
										opacity: 0.8,
										options: {
											url: 'https://urban-tep.eu/puma/backend/geoserver/wms',
											params: {
												layers: 'geonode:i82049_eo4sd_dhaka_lulcvhr_2017_clp_ar',
												styles: 'EO4SD_LULC_Level_1'
											}
										}
									}
								]}
								view={dhakaView}
							/>
						}
						controls={<MapControls/>}
					/>
				</div>

				<h2>Leaflet + Informal settlements aka Slums</h2>
				<div style={{height: 500}}>
					<PresentationMapWithControls
						map={
							<LeafletMap
								mapKey='leaflet-slums'
								backgroundLayer={osm}
								layers={[
									{
										key: 'informal-settlements',
										name: 'Informal Settlements',
										type: 'wms',
										opacity: 0.8,
										options: {
											url: 'https://urban-tep.eu/puma/backend/geoserver/wms',
											params: {
												layers: 'geonode:i81800_eo4sd_dhaka_informal_2017',
												styles: 'EO4SD_slum_typology_dhaka'
											}
										}
									}
								]}
								view={dhakaView}
							/>
						}
						controls={<MapControls levelsBased zoomOnly/>}
					/>
				</div>
			</div>
		);

};

export default Highlights;