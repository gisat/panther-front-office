import React from 'react';

import ScreenAnimator from "../../../presentation/ScreenAnimator/ScreenAnimator";
import ChangeReviewsList from './ChangeReviewsList';
import ChangeReviewForm from './ChangeReviewForm';

export default ({changeReviewsActiveScreenKey, activeEditedCase, setChangeReviewsActiveScreen, createLpisCase, editActiveEditedCase, createNewActiveEditedCase}) => {
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
				activeNewEditedCase={activeEditedCase}
				editActiveEditedCase={editActiveEditedCase}
				createNewActiveEditedCase={createNewActiveEditedCase}
			/>
		</ScreenAnimator>
	);
}