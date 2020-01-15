import React from 'react';

import ScreenAnimator from "../../../presentation/Deprecated_ScreenAnimator/Deprecated_ScreenAnimator";
import ChangeReviewsList from './ChangeReviewsList';
import ChangeReviewForm from './ChangeReviewForm';

export default (props) => {
	return (
		<ScreenAnimator
			activeScreenKey={props.changeReviewsActiveScreenKey}
		>
			<ChangeReviewsList
				screenKey="changeReviewsList"
				changeActiveScreen={props.setChangeReviewsActiveScreen}
				activeUserDromasLpisChangeReviewGroup={props.activeUserDromasLpisChangeReviewGroup}
			/>
			<ChangeReviewForm
				screenKey="changeReviewForm"
				changeActiveScreen={props.setChangeReviewsActiveScreen}
				createLpisCase={props.createLpisCase}
				activeNewEditedCase={props.activeEditedCase}
				editActiveEditedCase={props.editActiveEditedCase}
				clearActiveEditedCase={props.clearActiveEditedCase}
				createNewActiveEditedCase={props.createNewActiveEditedCase}
			/>
		</ScreenAnimator>
	);
}