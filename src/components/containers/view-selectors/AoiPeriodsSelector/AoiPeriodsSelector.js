import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../../../presentation/atoms/UISelect/index'

class AoiPeriodsSelector extends React.PureComponent {

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
		isDromasAdmin: PropTypes.bool
	};

	static defaultProps = {
		aois: null,
		periods: null
	};

	selectAoi(aoi){
		this.props.setActiveAoi(aoi.value);
		this.props.clearLayerPeriods();
		this.props.clearWmsLayers();
	}

	render() {
		let content = null;

		if (!this.props.isDromasAdmin && this.props.scope.restrictEditingToAdmins){

			if (this.props.activeAoi) {
				content = (
					<div className="ptr-aoi-selected"><span>DPB:</span>{this.props.activeAoi.code}</div>
				);
			} // else keep null

		} else {

			let options = [];
			let selected = null;
			let disabled = false;

			if (this.props.aois && this.props.scope && this.props.scope.aoiLayer){
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

			content = (
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
			);

		}

		return (
			<div className="ptr-view-selection-container">
				{content}
			</div>
		);
	}

}

export default AoiPeriodsSelector;
