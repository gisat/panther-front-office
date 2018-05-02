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
		isDromasAdmin: PropTypes.bool
	};

	static defaultProps = {
		places: null,
		periods: null,
		label: "Ohlášení územní změny:"
	};

	selectPlace(place){
		this.props.setActivePlace(place.value);
		this.props.clearLayerPeriods();
		this.props.clearWmsLayers();
		this.props.clearPlaceGeometryChangeReviewOfAllMaps();
	}

	render() {
		let content = null;

		if (!this.props.isDromasAdmin && this.props.scope.restrictEditingToAdmins){

			if (this.props.activePlace) {
				content = (
					<div className="ptr-aoi-selected"><span>{this.props.label}:</span>{this.props.activePlace.name}</div>
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

			content = [];

			if (this.props.homeLink && window.Config.toggles.home) {
				content.push((
					<a href={window.Config.toggles.home} style={{position: 'relative', left: -20}}>Home</a>
				));
			}

			content.push((
				<UISelect
					key='place-selector'
					classes='ptr-place-selector'
					label='left'
					name={this.props.label}
					onChange={this.selectPlace.bind(this)}
					options={options}
					placeholder=''
					value={selected}
					disabled={disabled}
				/>
			));

		}

		return (
			<div className="ptr-view-selection-container">
				{content}
			</div>
		);
	}

}

export default PlaceSelector;
