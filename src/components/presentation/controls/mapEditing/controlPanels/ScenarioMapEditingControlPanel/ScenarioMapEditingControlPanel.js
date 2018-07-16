import { connect } from 'react-redux';
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import Button from '../../../../atoms/Button'
import EditableText from '../../../../atoms/EditableText';
import MapEditingControlPanel from '../MapEditingControlPanel/MapEditingControlPanel';
import Names from "../../../../../../constants/Names";

import CustomOption from "../../../../atoms/UISelect/CustomOption/CustomOption";
import UISelect from "../../../../atoms/UISelect";

class ScenarioMapEditingControlPanel extends React.PureComponent {

	static propTypes = {
		discard: PropTypes.func,
		landCoverClasses: PropTypes.array,
		scenarioData: PropTypes.object,
		mapData: PropTypes.object,
	};

	constructor(props){
		super(props);

		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeLuClass = this.onChangeLuClass.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
		this.onDiscard = this.onDiscard.bind(this);
		this.onSave = this.onSave.bind(this);

		this.state = {
			luClass: this.getLuClassFromFeatures(this.props.selectedFeatures) || null
		}
	}

	componentWillReceiveProps(nextProps) {
		let oldClass = this.getLuClassFromFeatures(this.props.selectedFeatures);
		let nextClass = this.getLuClassFromFeatures(nextProps.selectedFeatures);
		if (nextClass !== oldClass) {
			this.setState({
				luClass: nextClass
			});
		}
	}

	getLuClassFromFeatures(features) {
		return features && features.length && features[0].data && features[0].data.properties && features[0].data.properties["CODE2012"]; //todo probably not that hard-coded
	}

	onChangeLuClass(value){
		if (value){
			this.setState({
				luClass: value.value
			});
			this.props.updateSelectedFeatures(value.value);
		}
	}

	onChangeName(value) {
		this.props.updateEditedScenario(this.props.scenarioData.key, 'name', value);
	}

	onChangeDescription(value) {
		this.props.updateEditedScenario(this.props.scenarioData.key, 'description', value);
	}

	onDiscard(){
		if (window.confirm(Names.SCENARIO_MAP_EDITING_CLOSE_MESSAGE)) {
			this.props.discard();
		}
	}

	onSave(){
		if (window.confirm(Names.SCENARIO_MAP_EDITING_SAVE_MESSAGE)) {
			this.props.save();
		}
	}

	render() {
		let name = this.props.scenarioData && this.props.scenarioData.data && this.props.scenarioData.data.hasOwnProperty('name') ? this.props.scenarioData.data.name : null;
		let description = this.props.scenarioData && this.props.scenarioData.data && this.props.scenarioData.data.hasOwnProperty('description') ? this.props.scenarioData.data.description : null;

		return (
			<MapEditingControlPanel
				title="Scenario editing"
			>
				<div className="ptr-editing-control-panel-content">
					<div className="ptr-editing-control-panel-content-header">
						<EditableText
							large
							value={name}
							placeholder="Edited scenario name"
							editing={true}
							required
							onChange={this.onChangeName}
						/>
						<EditableText
							value={description}
							placeholder="Description"
							editing={true}
							onChange={this.onChangeDescription}
						/>
					</div>
					<div className="ptr-editing-control-panel-content-body">
						{this.props.selectedFeatures && this.props.selectedFeatures.length ? (
						<div>
							<h3 className="ptr-editing-control-panel-section-title">Selected feature attributes</h3>
							{this.renderUrbanAtlasClassSelect()}
						</div>
						) : null}
					</div>
				</div>
				<div className="ptr-editing-control-panel-controls">
					<div>{this.renderButtons()}</div>
				</div>
			</MapEditingControlPanel>
		);
	}

	renderButtons(){
		let saveButton = this.props.scenarioData && this.props.scenarioData.data && this.props.scenarioData.data.name && !this.props.mapData.layerLoading;
		let discardButton = true;

		return (
			<div className="ptr-editing-control-panel-buttons">
				{saveButton ? (
					<Button key="save" onClick={this.onSave} primary>Save</Button>
				) : null}
				{discardButton ? (
					<Button key="discard" onClick={this.onDiscard}>Discard</Button>
				) : null}
			</div>
		);
	}

	renderUrbanAtlasClassSelect(){
		let options = this.props.landCoverClasses.map((lcClass) => {
			return {
				key: lcClass.value,
				value: lcClass.value,
				label: lcClass.name,
				color: lcClass.color
			}
		});

		return (
			<UISelect
				key='land-use-class-selector'
				label='left'
				name='LU/LC class'
				fullWidth
				onChange={this.onChangeLuClass}
				options={options}
				optionClassName='custom-option ua-legend-option'
				optionRenderer={this.renderUrbanAtlasClassSelectOption.bind(this)}
				placeholder=''
				resizable
				value={this.state.luClass}
				valueRenderer={this.renderUrbanAtlasClassSelectOption.bind(this)}
				disabled={!!this.props.disabled}
			/>
		);
	}

	renderUrbanAtlasClassSelectOption(option){
		let label = option.label.slice(6);

		return (
			<CustomOption
				key={option.value}
				value={option.value}
				label={label}
				color={option.color}
				type="Urban atlas legend"
			/>
		);
	}
}

export default ScenarioMapEditingControlPanel;