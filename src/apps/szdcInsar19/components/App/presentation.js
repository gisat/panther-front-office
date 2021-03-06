import React from 'react';
import _ from 'lodash';

import Map from "../../../../components/common/maps/Map";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import PantherSelect, {PantherSelectItem} from "../../../../components/common/atoms/PantherSelect";
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import MapPopup from "../MapPopup";
import TrackTimeSerieChart from "../TrackTimeSerieChart";
import ZoneClassificationTimeSerieChart from "../ZoneClassificationTimeSerieChart";
import TrackSelect from "./components/TrackSelect";
import PeriodSelect from "./components/PeriodSelect";
import MapControls from "../../../../components/common/maps/controls/MapControls/presentation";
import MapLegend from "../MapLegend";
import LayersControl from "../LayersControl";
import PointInfo from "../PointInfo";

const appViews = {
	track: {
		title: 'Časové řady a klasifikace v tracích',
		items: {
			totalDisplacement: {
				title: 'Celkový posun',
				colour: "#a64b"
			},
			dynamicTrend: {
				title: 'Dynamika',
				colour: "#a45b"
			},
			progress: {
				title: 'Vývoj',
				colour: "#a44b"
			},
			averageVelocity: {
				title: 'Rychlost posunu',
				colour: "#a34b"
			},
		},
		colour: "#a53b"
	},
	zoneClassification: {
		title: 'Zonální klasifikace s validací',
		items: {
			classification: {
				title: 'Klasifikace'
			},
			verticalMovement: {
				title: 'Vertikální posun'
			},
			combinedMovement: {
				title: 'Kombinovaný posun' //todo
			},
		},
		colour: "#37cb"
	}
};

class SzdcInsar19App extends React.PureComponent {

	constructor(props) {
		super(props);

		this.renderCurrent = this.renderCurrent.bind(this);
	}
	
	selectTrack(key, select) {
		let activeTracks = this.props.activeTracks && [...this.props.activeTracks] || this.props.areaTreeKeys && [this.props.areaTreeKeys[0]];
		if (select) {
			activeTracks.push(key);
		} else {
			activeTracks = _.without(activeTracks, key)
		}
		this.props.selectTracks(activeTracks);
	}
	
	render() {
		
		let props = this.props;
		let currentStyle, category, view;
		if (props.activeAppView) {
			[category, view] = props.activeAppView.split('.');
			currentStyle = {background: appViews[category].colour};
		}
		
		let activeTracks = props.activeTracks || props.areaTreeKeys && [props.areaTreeKeys[0]];
		
		return (
			<div className="szdcInsar19-app">
				<div className="szdcInsar19-header">
					<PantherSelect
						className="szdcInsar19-view-select"
						open={props.viewSelectOpen || !props.activeAppView}
						onSelectClick={() => {
							(props.viewSelectOpen && props.activeAppView) ? props.closeViewSelect() : props.openViewSelect()
						}}
						onSelect={this.props.selectAppView}
						currentClasses="szdcInsar19-view-select-current"
						currentStyle={currentStyle}
						renderCurrent={this.renderCurrent}
						listClasses="szdcInsar19-view-select-list"
					>
						{this.renderSelectItems(props.trackViews, props.zoneClassificationViews)}
					</PantherSelect>
					{category && props.periods ? (
						<PeriodSelect
							periods={props.periods}
							periodKeys={props.periods ? _.map(props.periods, (uuid) => uuid) : null}
							activePeriodKey={props.activePeriod}
						/>
					) : null }
					{(category === 'track') && props.areaTreeKeys ? (
						<TrackSelect
							activeTracks={activeTracks}
							areaTreeKeys={props.areaTreeKeys}
						/>
					) : null }
				</div>
				<div className="szdcInsar19-content">
					<div className="szdcInsar19-map">
						<HoverHandler
							popupContentComponent={MapPopup}
						>
							<Map stateMapKey="szdcInsar19" mapComponent={WorldWindMap} levelsBased>
								{props.customLayers && props.activeAppView ? (
									<LayersControl
										layers={props.customLayers}
									/>
								) : <></>}
								<MapControls zoomOnly levelsBased/>
							</Map>
						</HoverHandler>
					</div>
					
					<div className="szdcInsar19-visualization">
						<div className="szdcInsar19-detail">
							<div className="szdcInsar19-detail-info">
								<PointInfo/>
							</div>
							{category === "track" ? (
								<div className="szdcInsar19-detail-chart">
									<TrackTimeSerieChart
										currentAttributeKey={props.dAttribute}
									/>
								</div>
							) : null}
						</div>
						<div className="szdcInsar19-legend">
							<MapLegend
								activeAppView={props.activeAppView}
							/>
						</div>
					</div>
				</div>
			
			</div>
		);
	}
	
	renderCurrent() {
		if (this.props.activeAppView) {
			let [category, view] = this.props.activeAppView.split('.');

			return (
				<div>
					<span>{appViews[category].title}:</span> {appViews[category].items[view].title}
				</div>
			);

		} else {

			return (
				<div></div>
			);

		}

	}

	renderSelectItems(trackViews, zoneClassificationViews) {

		let configurations = {
			track: trackViews,
			zoneClassification: zoneClassificationViews
		}; // todo better solution


		return _.map(appViews, (category, categoryKey) => {

			let items = [];
			_.each(category.items, (item, itemKey) => {
				if (
					configurations[categoryKey]
					&& configurations[categoryKey][itemKey]
					&& (configurations[categoryKey][itemKey].attribute || configurations[categoryKey][itemKey].attributes)
					&& configurations[categoryKey][itemKey].style
				) {
					items.push((
						<PantherSelectItem
							key={itemKey}
							itemKey={categoryKey + '.' + itemKey}
							// style={{background: item.colour}}
						>
							{item.title}
						</PantherSelectItem>
					));
				}
			});

			return !items.length ? null : (
				<div className="szdcInsar19-select-category" key={categoryKey} style={{background: category.colour}}>
					<span>{category.title}</span>
					{items}
				</div>
			);
		});

	}
	
}

export default SzdcInsar19App;