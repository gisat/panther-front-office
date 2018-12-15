import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './style.css';

class PucsClimateFitIntroHeader extends React.PureComponent {

	static propTypes = {
		title: PropTypes.string,
		description: PropTypes.string,
		backgroundSource: PropTypes.string,
		logoSource: PropTypes.string
	};

	render() {
		let style = {
			backgroundImage: (this.props.backgroundSource ? `url(${this.props.backgroundSource})` : `none`)
		};

		return (
			<div style={style} className="ptr-pucs-intro-header">
				{this.props.logoSource ? (
					<div className="ptr-pucs-intro-header-logo">
						<img src={this.props.logoSource}/>
					</div>
				): null}
				<div className="ptr-pucs-intro-header-text">
					{this.props.title ? (
						<div className="ptr-views-list-title">{this.props.title }</div>
					) : null}
					{this.props.description ? (
						<div
							className="ptr-views-list-description"
							dangerouslySetInnerHTML={{__html: this.props.description}}
						>
						</div>
					) : null}
				</div>
			</div>
		);
	}
}

export default PucsClimateFitIntroHeader;