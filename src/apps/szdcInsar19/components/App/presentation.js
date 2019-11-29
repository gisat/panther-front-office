import React from 'react';
import _ from 'lodash';

import Map from "../../../../components/common/maps/Map";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import PantherSelect, {PantherSelectItem} from "../../../../components/common/atoms/PantherSelect";

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
	
	render() {
		
		let props = this.props;
		let currentStyle;
		if (props.activeAppView) {
			let [category, view] = props.activeAppView.split('.');
			currentStyle = {background: appViews[category].colour};
		}
		
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
				</div>
				<div className="szdcInsar19-content">
					<div className="szdcInsar19-map">
						<Map stateMapKey="szdcInsar19" mapComponent={WorldWindMap}/>
					</div>
					<div className="szdcInsar19-visualization">
					
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
				<div className="szdcInsar19-select-category" style={{background: category.colour}}>
					<span>{category.title}</span>
					{items}
				</div>
			);
		});

	}
	
}

export default SzdcInsar19App;