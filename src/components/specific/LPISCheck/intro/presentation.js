import React from 'react';

import ScreenAnimator from "../../../presentation/Deprecated_ScreenAnimator/Deprecated_ScreenAnimator";
import ChangeReviewsList from './ChangeReviewsList';


class intro extends React.Component{
	componentDidMount() {
		this.props.onMount(this.props.activeViewKey);
	}
	render() {
		return (
			<ScreenAnimator>
				<ChangeReviewsList
					screenKey="changeReviewsList"
				/>
			</ScreenAnimator>
		);
	}
}

export default intro;