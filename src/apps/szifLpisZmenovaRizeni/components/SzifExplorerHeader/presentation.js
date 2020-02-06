import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import Button from "../../../../components/common/atoms/Button";

class DromasLpisChangeReviewHeader extends React.PureComponent {

	static propTypes = {
		switchScreen: PropTypes.func,
		loadSentinels: PropTypes.func,
		mapSet: PropTypes.object,
		getDatesUrl: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.switchScreen = props.switchScreen.bind(this, 'szifCaseTable');
		this.loadSentinels = this.loadSentinels.bind(this);
	}

	loadSentinels() {
		const {loadSentinels, mapSet, getDatesUrl} = this.props;
		loadSentinels(mapSet, getDatesUrl);
	}
	render() {
		return (
			<div className="szifLpisZmenovaRizeni-sentinel-explorer-header">
				<div>
					<Button invisible inverted icon="back" onClick={this.switchScreen}/>
				</div>
				<div className="szifLpisZmenovaRizeni-sentinel-explorer-header-rightblock">
					<Button ghost inverted icon="download" onClick={this.loadSentinels}>
						Načíst sentinel data
					</Button>
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;
