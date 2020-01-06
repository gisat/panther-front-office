import React from "react";

import './style.scss';
import classnames from "classnames";
import Button from "../../../../../../components/common/atoms/Button";
import {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import utils from "../../../../../../utils/utils";

class PlaceSelectContent extends React.PureComponent {
	
	componentDidMount() {
		this.props.onMount();
	}
	
	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		const props = this.props;

		let classes = classnames("scudeoCities-place-select-content", {});

		return (

			<div className={classes}>
				{this.props.places && this.props.places.map(place => (
					<PantherSelectItem itemKey={place.key}>
						<div
							className="scudeoCities-place-list-place"
							style={{
								backgroundColor: utils.stringToColours(place.key, 1, {
									hue: [0,360],
									saturation: [45,65],
									lightness: [30,35]
								})
							}}
						>{place.data.nameDisplay}</div>
					</PantherSelectItem>
				))}
			</div>

		);
	}
}

export default PlaceSelectContent;
