import React from 'react';
import Map from "../../../../components/common/maps/Map";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import PantherSelect from "../../../../components/common/atoms/PantherSelect";

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
						<div>content</div>
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
	
}

export default SzdcInsar19App;