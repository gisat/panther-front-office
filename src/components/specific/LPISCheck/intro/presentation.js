import React from 'react';

import ScreenAnimator from "../../../presentation/ScreenAnimator/ScreenAnimator";
import ChangeReviewsList from './ChangeReviewsList';


class intro extends React.Component{
	render() {
		return (
			<ScreenAnimator>
				<ChangeReviewsList
					screenKey="changeReviewsList"
					scopeKey={this.props.scope.key}
				/>
			</ScreenAnimator>
		);
	}
}

export default intro;