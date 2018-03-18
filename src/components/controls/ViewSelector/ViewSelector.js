import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../../atoms/UISelect'

class ViewSelector extends React.PureComponent {

	static propTypes = {
		activeScope: PropTypes.shape({
			viewSelection: PropTypes.string
		})
	};

	static defaultProps = {
		aois: [{
			key: '1224/4',
			geometry: null
		},{
			key: '2224',
			geometry: null
		},{
			key: '7896654455662785566224/4',
			geometry: null
		}],
		periods: null
	};

	constructor(props) {
		super();
	}

	handleAoiChange(a){
		debugger;
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

		this.props.aois.map(aoi => {
			options.push({
				value: aoi.key,
				label: aoi.key
			})
		});

		return (
			<UISelect
				classes='ptr-aoi-selector'
				label='left'
				name='AOI'
				onChange={this.handleAoiChange.bind(this)}
				options={options}
				placeholder='Insert AOI code'
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
