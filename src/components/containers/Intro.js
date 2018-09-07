import React from 'react';
import { connect } from 'react-redux';

import Select from '../../state/Select';

import Intro from "../presentation/Intro/Intro";

const mapStateToProps = (state) => {
	return {
		logo: Select.components.overlays.views.getIntroLogo(state),
		title: Select.components.overlays.views.getIntroTitle(state),
		text: Select.components.overlays.views.getIntroText(state),
		sections: Select.components.overlays.views.getIntroSections(state)
	};
};

export default connect(mapStateToProps)(Intro);
