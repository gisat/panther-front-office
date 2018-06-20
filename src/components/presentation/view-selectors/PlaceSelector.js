import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../atoms/UISelect'

class PlaceSelector extends React.PureComponent {

	static propTypes = {
		activePlace: PropTypes.object,
		places: PropTypes.array,
		onChangePlace: PropTypes.func,
		label: PropTypes.string,
		homeLink: PropTypes.bool,
		homeLinkLabel: PropTypes.string
	};

	static defaultProps = {
		places: null,
		label: "Place",
		homeLinkLabel: "Home"
	};

	constructor(props) {
		super(props);

		this.onChangePlace = this.onChangePlace.bind(this);
	}

	onChangePlace(object){
		this.props.onChangePlace(object.value);
	}

	render() {
		let content = null;

		if (this.props.disabledHard){

			if (this.props.activePlace) {
				content = (
					<div className="ptr-aoi-selected"><span>{this.props.label}:</span>{this.props.activePlace.name}</div>
				);
			} // else keep null

		} else {

			let options = [];
			let selected = null;

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
					<a href={window.Config.toggles.home} style={{position: 'relative', left: -20}}>{this.props.homeLinkLabel}</a>
				));
			}

			content.push((
				<UISelect
					key='place-selector'
					classes='ptr-place-selector ptr-view-selection-selector'
					label='left'
					name={this.props.label}
					onChange={this.onChangePlace}
					options={options}
					placeholder=''
					value={selected}
					virtualized
					disabled={!!this.props.disabled}
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
