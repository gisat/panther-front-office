import React from 'react';
import _ from 'lodash';

class ControlPanel extends React.PureComponent {
	constructor(props){
		super(props);
		this.onLayerTemplateChange = this.onLayerTemplateChange.bind(this);
		this.onCaseChange = this.onCaseChange.bind(this);
	}

	componentDidMount() {

	}

	onCaseChange(e) {
		if (e.target.value) {
			this.props.setActiveCase(e.target.value);
		}
	}

	onLayerTemplateChange(e) {
		if (e.target.value) {
			if (e.target.checked) {
				this.props.addLayer(e.target.value);
			} else {
				this.props.removeLayer(e.target.value);
			}
		}
	}

	render() {
		return (
			<div className="demo-map-store-control-panel">
				{/*<h3>Add/remove map layer</h3>*/}
				{/*<form>*/}
					{/*{this.props.layerTemplates.map(layerTemplate => {*/}
						{/*return (*/}
							{/*<label key={layerTemplate.key}>*/}
								{/*<input*/}
									{/*type="checkbox"*/}
									{/*value={layerTemplate.key}*/}
									{/*checked={this.props.layers && !!_.find(this.props.layers, {layerTemplateKey: layerTemplate.key})}*/}
									{/*onChange={this.onLayerTemplateChange}*/}
								{/*/>*/}
								{/*{layerTemplate.data.name}*/}
							{/*</label>*/}
						{/*);*/}
					{/*})}*/}

				{/*</form>*/}

				<h3>Select active case</h3>
				<form>
					{this.props.cases.map(caseItem => {
						return (
							<label key={caseItem.key}>
								<input
									type="radio"
									value={caseItem.key}
									checked={this.props.activeCaseKey === caseItem.key}
									onChange={this.onCaseChange}
								/>
								{caseItem.data.name}
							</label>
						);
					})}

				</form>
			</div>
		);
	}
}

export default ControlPanel;