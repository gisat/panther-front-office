import React from "react";

import PresentationMapWithControls from "../../../../../../components/common/maps/PresentationMapWithControls";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";
import MapControls from "../../../../../../components/common/maps/MapControls/presentation";
import LeafletMap from "../../../../../../components/common/maps/LeafletMap/presentation";
import conversions from "../../../../data/conversions";

import * as dodoma_au_level_1 from '../../../../data/EO4SD_DODOMA_AL1.json';
import * as dodoma_au_level_2 from '../../../../data/EO4SD_DODOMA_AL2.json';
import * as dodoma_au_level_3 from '../../../../data/EO4SD_DODOMA_AL3.json';
import HoverHandler from "../../../../../../components/common/HoverHandler/HoverHandler";
import LineChart from "../../../../../../components/common/charts/LineChart/LineChart";
import ColumnChart from "../../../../../../components/common/charts/ColumnChart/ColumnChart";
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";

const level_1 = conversions.featuresToSerialData(dodoma_au_level_1.features);
const level_2 = conversions.featuresToSerialData(dodoma_au_level_2.features);
const level_3 = conversions.featuresToSerialData(dodoma_au_level_3.features);

const transportation_level_1_2006 = conversions.featuresToAttributes(dodoma_au_level_1.features, 'AL1_ID', '2006',[
	{key: 'as_653001000_attr_653000010', name: 'Total roads length'},
	{key: 'as_651001000_attr_651000100', name: 'Motorways'},
	{key: 'as_651001000_attr_651000200', name: 'Primary'},
	{key: 'as_651001000_attr_651000300', name: 'Secondary'},
	{key: 'as_651001000_attr_651000400', name: 'Local'},
	{key: 'as_651002000_attr_651000500', name: 'Railways'}
])['8216d59d-baaf-4e94-8ad4-15c78e61b28e'];

const transportation_level_1_2006_normalized = conversions.featuresToAttributes(dodoma_au_level_1.features, 'AL1_ID', '2006',[
	{key: 'as_651001000_attr_651000100', name: 'Motorways'},
	{key: 'as_651001000_attr_651000200', name: 'Primary'},
	{key: 'as_651001000_attr_651000300', name: 'Secondary'},
	{key: 'as_651001000_attr_651000400', name: 'Local'},
	{key: 'as_651002000_attr_651000500', name: 'Railways'}
],'as_653001000_attr_653000010_p_600002006')['8216d59d-baaf-4e94-8ad4-15c78e61b28e'];

const dhakaView = {
	center: {
		lat: 23.78,
		lon: 90.41
	},
	boxRange: 60035
};

const dodomaView = {
	center: {
		lat: -6.174,
		lon: 35.704
	},
	boxRange: 50000
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

const dodomaAuLevel3 = {
	key: 'dodomaAuLevel3',
	name: 'Analytical units 3',
	type: 'vector',
	options: {
		features: dodoma_au_level_3.features
	}
};

const Dhaka = props => {

	return (
		<>
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

			<h2>Leaflet - Dodoma</h2>
			<div style={{height: 500}}>
				<PresentationMapWithControls
					map={
						<LeafletMap
							mapKey='leaflet-dodoma'
							backgroundLayer={osm}
							layers={[dodomaAuLevel3]}
							view={dodomaView}
						/>
					}
					controls={<MapControls levelsBased zoomOnly/>}
				/>
			</div>

			<h2>Transportation network - Total Roads Lengths (Level 3)</h2>
			<p>In this case, we can aggregate or color lines as well.</p>
			<div style={{marginTop: 30 ,padding: 30, background: '#eeeeee', width: 800}}>
				<HoverHandler>
					<LineChart
						key="dodoma-level-3"

						data={level_3}
						keySourcePath="AL3_ID"
						nameSourcePath="AL3_NAME"
						serieDataSourcePath="data"
						xSourcePath="period"
						ySourcePath="as_653002000_attr_653000010"

						sorting={[["period", "asc"]]}

						height={20}
						yValuesSize={4}
						yLabel
						yOptions={{
							name: "Total Roads Lengths",
							unit: "m"
						}}
					/>
				</HoverHandler>
			</div>

			<h2>Transportation network - Total Roads Lengths (Level 2)</h2>
			<div style={{marginTop: 30 ,padding: 30, background: '#eeeeee', width: 800}}>
				<HoverHandler>
					<LineChart
						key="dodoma-level-2"

						data={level_2}
						keySourcePath="AL2_ID"
						nameSourcePath="AL2_NAME"
						serieDataSourcePath="data"
						xSourcePath="period"
						ySourcePath="as_653002000_attr_653000010"

						sorting={[["period", "asc"]]}

						height={20}
						yValuesSize={4}
						yLabel
						yOptions={{
							name: "Total Roads Lengths",
							unit: "m"
						}}
					/>
				</HoverHandler>
			</div>

			<h2>13400 - Land without current use 2006 (Level 3)</h2>
			<div style={{marginTop: 30 ,padding: 30, background: '#eeeeee', width: 800}}>
				<HoverHandler>
					<ColumnChart
						key="land-without-use"

						data={level_3}
						keySourcePath="AL3_ID"
						nameSourcePath="AL3_NAME"
						xSourcePath="AL3_NAME"
						ySourcePath="data[0].as_624006000_attr_613134000"

						sorting={[["data[0].as_624006000_attr_613134000","desc"]]}

						xValuesSize={5}
						yValuesSize={5}
					/>
				</HoverHandler>
			</div>

			<h2>Transportation (Level 1)</h2>
			<div style={{marginTop: 30 ,padding: 30, background: '#eeeeee', width: 800}}>
				<HoverHandler>
					<ColumnChart
						key="transportation"

						data={transportation_level_1_2006}
						keySourcePath="key"
						nameSourcePath="name"
						xSourcePath="name"
						ySourcePath="value"

						xValuesSize={6}
						yValuesSize={5}
						yLabel
						yOptions={{
							name: "Length",
							unit: "m"
						}}

						defaultSchemeBarColors
					/>
				</HoverHandler>
			</div>

			<div style={{marginTop: 30 ,padding: 30, background: '#eeeeee', width: 800}}>
				<HoverHandler>
					<AsterChart
						key="radials"

						data={transportation_level_1_2006_normalized}
						keySourcePath="key"
						nameSourcePath="name"
						valueSourcePath="value"

						radialsLabels

						relative

						legend
					/>
				</HoverHandler>
			</div>
		</>
	);
	
};

export default Dhaka;