import React from "react";

import './style.scss';
import classnames from "classnames";
import Button from "../../../../../../components/common/atoms/Button";

class PlaceSelectContent extends React.PureComponent {

	render() {
		const props = this.props;

		let classes = classnames("scudeoCities-place-select-content", {});

		return (

			<div className={classes}>
				
			</div>

		);
	}
}

export default PlaceSelectContent;
