import React from "react";

import LandingPage from '../LandingPage';
import Header from '../Header';
import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';

export default props => {
	// if (false) {
	if (!props.activeScopeKey) {

		return React.createElement(LandingPage);

	} else {

		return (
			<div className="esponFuore-app">
				<Header />
				<div className="esponFuore-content">
					<AdjustableColumns content={[
						{
							render: props => (<div>ONE</div>)
						},
						{
							width: "10rem",
							render: props => (<div>TWO</div>)
						},
					]} />
				</div>
			</div>
		);

	}
}