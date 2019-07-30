import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import './style.css'

class Attribution extends React.PureComponent {

	static propTypes = {
		dark: PropTypes.bool,
		data: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.array
		])
	};

	render() {
		let attribution = this.getAttribution();
		let classes = classNames("ptr-world-wind-map-attribution",{
			dark: this.props.dark
		});

		return (
			<div
				className={classes}
				dangerouslySetInnerHTML={{__html: attribution}}
			>
			</div>
		);
	}

	getAttribution() {
		if (_.isArray(this.props.data)){
			return this.props.data.join(" | ");
		} else {
			return this.props.data;
		}
	}
}

export default Attribution;
