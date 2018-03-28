import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../../../atoms/UISelect/index'

class ViewSelector extends React.PureComponent {

	static propTypes = {
		activeAoi: PropTypes.object,
		scope: PropTypes.shape({
			aoiLayer: PropTypes.shape({
				idColumn: PropTypes.string,
				key: PropTypes.string
			}),
			viewSelection: PropTypes.string
		}),
		aois: PropTypes.array,
		userIsAdmin: PropTypes.bool
	};

	static defaultProps = {
		aois: null,
		periods: null
	};

	constructor(props) {
		super();
	}

	selectAoi(aoi){
		this.props.setActiveAoi(aoi.value);
		this.props.clearLayerPeriods();
		this.props.clearWmsLayers();
	}

	render() {
		let content = [];
		let activeScope = this.props.scope;
		if (activeScope && activeScope.viewSelection){
			content = this.renderContent(activeScope.viewSelection);
			return (
				<div className="ptr-view-selection-container">
					{content}
				</div>
			);
		} else {
			return (
				<div>
					Loading...
				</div>
			)
		}
	}

	/**
	 * @param selectorType {string}
	 * @returns {Array}
	 */
	renderContent(selectorType){
		let content = [];
		switch (selectorType){
			case 'aoiPeriodsSelector':
				content.push(this.renderAoiSelector());
				// content.push(this.renderPeriodSelector());
				break;
		}
		return content;
	}

	renderAoiSelector(){
		let options = [];
		let selected = null;
		let disabled = false;

		if (this.props.aois && this.props.scope && this.props.scope.aoiLayer){
			let columnId = this.props.scope.aoiLayer.idColumn;
			this.props.aois.map(aoi => {
				options.push({
					key: aoi.key,
					value: aoi.key,
					label: aoi.code
				})
			});

			if (this.props.activeAoi){
				selected = this.props.activeAoi.key
			}
		}

		if (!this.props.userIsAdmin && this.props.scope.restrictEditingToAdmins){

			if (this.props.activeAoi) {
				return (
					<div className="ptr-aoi-selected"><span>DPB:</span>{this.props.activeAoi.code}</div>
				);
			} else {
				return null;
			}

		}

		return (
			<UISelect
				key='aoi-selector'
				classes='ptr-aoi-selector'
				label='left'
				name='AOI'
				onChange={this.selectAoi.bind(this)}
				options={options}
				placeholder='Insert AOI code'
				value={selected}
				disabled={disabled}
			/>
		)
	}

	renderPeriodSelector(){
		return (
			<UISelect
				classes='ptr-period-selector'
				name='Season'
			/>
		)
	}

}

export default ViewSelector;
