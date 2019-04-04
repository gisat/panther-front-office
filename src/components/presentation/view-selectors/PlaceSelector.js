import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../atoms/UISelect'
import classNames from 'classnames';

let polyglot = window.polyglot;

class PlaceSelector extends React.PureComponent {

	static propTypes = {
		activePlace: PropTypes.object,
		isInIntroMode: PropTypes.bool,
		places: PropTypes.array,
		onChangePlace: PropTypes.func,
		onMount: PropTypes.func,
		label: PropTypes.string,
		homeLink: PropTypes.bool,
		classes: PropTypes.string
	};

	static defaultProps = {
		places: null,
		homeLinkLabel: "Home"
	};

	constructor(props) {
		super(props);

		this.onChangePlace = this.onChangePlace.bind(this);
	}

	componentDidMount(){
		if (!this.props.isInIntroMode && this.props.onMount){ //TODO remove dependency on mode
			this.props.onMount();
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount){
			this.props.onUnmount();
		}
	}

	onChangePlace(object){
		this.props.onChangePlace(object.value);
	}

	render() {
		const place = polyglot.t('place');
		let content = null;

		if (this.props.disabledHard){

			if (this.props.activePlace && this.props.activePlace.data) {
				content = (
					<div className="ptr-aoi-selected"><span>{place}:</span>{this.props.activePlace.data.name}</div>
				);
			} // else keep null

		} else {

			let options = [];
			let selected = null;

			if (this.props.places){
				this.props.places.map(place => {
					if (place) {
						options.push({
							key: place.key,
							value: place.key,
							label: place.data && place.data.name
						});
					}
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

			let scope = this.props.activeScope;
			const hide = scope.data.removedTools && scope.data.removedTools.indexOf('place') !== -1;

			let classes = classNames("ptr-place-selector ptr-view-selection-selector", this.props.classes);

			if(!hide) {
				content.push((
					<UISelect
						key='place-selector'
						clearable={false}
						classes={classes}
						label='left'
						name={place}
						onChange={this.onChangePlace}
						options={options}
						placeholder=''
						value={selected}
						disabled={!!this.props.disabled}
					/>
				));
			}

		}

		return (
			<div className="ptr-view-selection-container">
				{content}
			</div>
		);
	}

}

export default PlaceSelector;
