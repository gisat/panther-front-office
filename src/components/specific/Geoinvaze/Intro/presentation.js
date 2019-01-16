import React from 'react';
import IntroHeader from "../../../common/intro/introHeader/presentation";
import VisualsConfig from "../../../../constants/VisualsConfig";
import PropTypes from "prop-types";

class GeoinvIntro extends React.PureComponent{
	render() {
		let data = VisualsConfig["geoinvaze"];

		return (
			<div>
				<IntroHeader
					title={data.headerTitle}
					description=""
					backgroundSource={data.introHeaderBackgroundSrc}
					logoSource={data.introLogoSrc}
					withBackgroundOverlay
				/>
			</div>
		);
	}
}

export default GeoinvIntro;