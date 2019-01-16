import React from 'react';
import IntroHeader from "../../../common/intro/introHeader/presentation";
import VisualsConfig from "../../../../constants/VisualsConfig";
import PropTypes from "prop-types";

class GeoinvIntro extends React.PureComponent{
	static propTypes = {
		style: PropTypes.string
	};

	render() {
		let data = VisualsConfig[this.props.style];

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