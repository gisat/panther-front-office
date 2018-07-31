import React from 'react';

import ScreenAnimator from "../../../presentation/ScreenAnimator/ScreenAnimator";
import ChangeReviewsList from '../../../containers/controls/ChangeReviewsList';
import ChangeReviewForm from '../../../presentation/controls/changeReviews/ChangeReviewForm/ChangeReviewForm';

export default ({changeReviewsActiveScreenKey, activeNewEditedCase, setChangeReviewsActiveScreen, createLpisCase, editActiveEditedCase, createNewActiveEditedCase}) => {
	return (
		<ScreenAnimator
			activeScreenKey={changeReviewsActiveScreenKey}
		>
			<ChangeReviewsList
				screenKey="changeReviewsList"
				changeActiveScreen={setChangeReviewsActiveScreen}
			/>
			<ChangeReviewForm
				screenKey="changeReviewForm"
				changeActiveScreen={setChangeReviewsActiveScreen}
				createLpisCase={createLpisCase}
				activeNewEditedCase={activeNewEditedCase}
				editActiveEditedCase={editActiveEditedCase}
				createNewActiveEditedCase={createNewActiveEditedCase}
			/>
		</ScreenAnimator>
	);
}