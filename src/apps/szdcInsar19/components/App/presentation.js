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
				title: 'Celkový posun'
			},
			dynamicTrend: {
				title: 'Dynamika'
			},
			progress: {
				title: 'Vývoj'
			},
			averageVelocity: {
				title: 'Rychlost posunu'
			},
		}
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
		}
	}
};

class SzdcInsar19App extends React.PureComponent {
	
	render() {
		
		let props = this.props;
		
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
		return (
			<div>current</div>
		);
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
						>
							{item.title}
						</PantherSelectItem>
					));
				}
			});

			return !items.length ? null : (
				<div className="szdcInsar19-select-category">
					<span>{category.title}</span>
					{items}
				</div>
			);
		});

	}
	
}

export default SzdcInsar19App;