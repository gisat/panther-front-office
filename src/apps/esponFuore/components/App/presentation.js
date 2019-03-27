import React from "react";

import LandingPage from '../LandingPage';
import Header from '../Header';
import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';

export default props => {
	// if (false) {
	if (!props.activeScopeKey) {

		return React.createElement(LandingPage);

	} else {

		return (
			<div className="esponFuore-app">
				<Header />
				<div className="esponFuore-content">
					<WindowsContainer>
					<AdjustableColumns
						fixed
						content={[
							{
								render: props => (<div>ONE</div>)
							},
							{
								width: "25rem",
								render: props => (<div>TWO</div>)
							},
						]}
					/>
					</WindowsContainer>
				</div>
			</div>
		);

	}
}