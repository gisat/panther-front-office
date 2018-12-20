import React from 'react';

import ScreenAnimator from "../../../presentation/ScreenAnimator/ScreenAnimator";
import ChangeReviewsList from './ChangeReviewsList';

export default (props) => {
	return (
		<ScreenAnimator>
			<ChangeReviewsList
				screenKey="changeReviewsList"
			/>
		</ScreenAnimator>
	);
}