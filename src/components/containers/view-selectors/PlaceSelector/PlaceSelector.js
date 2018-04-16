import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../../../presentation/atoms/UISelect/index'

class PlaceSelector extends React.PureComponent {

	static propTypes = {
		activeAoi: PropTypes.object,
		scope: PropTypes.shape({
			viewSelection: PropTypes.string
		}),
		places: PropTypes.array,
		userIsAdmin: PropTypes.bool
	};

	static defaultProps = {
		places: null,
		periods: null
	};

	selectPlace(place){
		this.props.setActivePlace(place.value);
		this.props.clearLayerPeriods();
		this.props.clearWmsLayers();
		this.props.clearPlaceGeometryChangeReviewOfAllMaps();
	}

	render() {
		let content = null;

		if (!this.props.userIsAdmin && this.props.scope.restrictEditingToAdmins){

			if (this.props.activePlace) {
				content = (
					<div className="ptr-aoi-selected"><span>DPB:</span>{this.props.activePlace.name}</div>
				);
			} // else keep null

		} else {

			let options = [];
			let selected = null;
			let disabled = false;

			if (this.props.places){
				this.props.places.map(place => {
					options.push({
						key: place.key,
						value: place.key,
						label: place.name
					})
				});

				if (this.props.activePlace){
					selected = this.props.activePlace.key
				}
			}

			content = (
				<UISelect
					key='place-selector'
					classes='ptr-place-selector'
					label='left'
					name='Place'
					onChange={this.selectPlace.bind(this)}
					options={options}
					placeholder=''
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

export default PlaceSelector;
