import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import classnames from "classnames";
import PlaceSelectContent from "../PlaceSelectContent";

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
		if (!this.props.activePlace || (key !== this.props.activePlace.key)) {
			this.props.selectPlace(key);
		}
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
				open={props.placeSelectOpen || !props.activePlace}
				currentDisabled={!props.activePlace}
				onSelectClick={() => {
					props.placeSelectOpen ? props.closeSelect() : props.openSelect()
				}}
				onSelect={this.selectPlace}
				currentClasses="scudeoCities-place-select-current"
				renderCurrent={this.renderCurrent}
				listClasses="scudeoCities-place-select-list"
			>
				<div className="scudeoCities-place-select-overlay">
					<div className="scudeoCities-place-select-overlay-header">
						Hic sunt pantherae.
					</div>
					<PlaceSelectContent />
				</div>
			</PantherSelect>

		);
	}
}

export default PlaceSelect;
