import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import classnames from "classnames";
import PlaceSelectContent from "../PlaceSelectContent";
import {utils} from "panther-utils"

class PlaceSelect extends React.PureComponent {

	constructor(props) {
		super(props);
		this.renderCurrent = this.renderCurrent.bind(this);
		this.selectPlace = this.selectPlace.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	selectPlace(key) {
		// if (!this.props.activePlace || (key !== this.props.activePlace.key)) {
			this.props.selectPlace(key);
		// }
	}

	renderCurrent() {
		const activePlace = this.props.activePlace;
		if (activePlace) {
			return (
				<div className="scudeoCities-place-value" title={activePlace.data && activePlace.data.nameDisplay}>
					{activePlace.data && activePlace.data.nameDisplay}
				</div>
			);
		} else {
			//no place
			return null;
		}
	};

	render() {
		const props = this.props;

		return (

			<PantherSelect
				className="scudeoCities-place-select"
				open={props.placeSelectOpen || !props.activePlaceKey}
				currentDisabled={!props.activePlaceKey}
				onSelectClick={() => {
					props.placeSelectOpen ? props.closeSelect() : props.openSelect()
				}}
				onSelect={this.selectPlace}
				currentClasses="scudeoCities-place-select-current"
				renderCurrent={this.renderCurrent}
				currentStyle={props.activePlaceKey ? {
					backgroundColor: utils.stringToColours(props.activePlaceKey, 1, {
					hue: [0,360],
					saturation: [45,65],
					lightness: [30,35]
				})
				} : null}
				listClasses="scudeoCities-place-select-list"
			>
				<div className="scudeoCities-place-select-overlay">
					<PlaceSelectContent />
				</div>
			</PantherSelect>

		);
	}
}

export default PlaceSelect;
