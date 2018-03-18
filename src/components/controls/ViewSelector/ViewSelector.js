import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../../atoms/UISelect'

class ViewSelector extends React.PureComponent {

	static propTypes = {
		activeAoi: PropTypes.object,
		activeScope: PropTypes.shape({
			aoiLayer: PropTypes.shape({
				idColumn: PropTypes.string,
				key: PropTypes.string
			}),
			viewSelection: PropTypes.string
		}),
		aois: PropTypes.array
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
	}

	render() {
		let content = [];
		let activeScope = this.props.activeScope;
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

		if (this.props.aois && this.props.activeScope && this.props.activeScope.aoiLayer){
			let columnId = this.props.activeScope.aoiLayer.idColumn;
			this.props.aois.map(aoi => {
				options.push({
					value: aoi.id,
					label: aoi.properties[columnId]
				})
			});

			if (this.props.activeAoi){
				selected = this.props.activeAoi.id
			}
		}

		return (
			<UISelect
				classes='ptr-aoi-selector'
				label='left'
				name='AOI'
				onChange={this.selectAoi.bind(this)}
				options={options}
				placeholder='Insert AOI code'
				value={selected}
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
