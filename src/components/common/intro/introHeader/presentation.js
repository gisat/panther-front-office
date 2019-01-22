import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import './style.css';

class IntroHeader extends React.PureComponent {

	static propTypes = {
		title: PropTypes.string,
		description: PropTypes.string,
		backgroundSource: PropTypes.string,
		logoSource: PropTypes.string,
		withBackgroundOverlay: PropTypes.bool
	};

	render() {
		let style = {
			backgroundImage: (this.props.backgroundSource ? `url(${this.props.backgroundSource})` : `none`)
		};

		let classes = classnames("ptr-intro-header", {
			small: !this.props.logoSource
		});

		return (
			<div style={style} className={classes}>
				{this.props.withBackgroundOverlay ? (<div className="ptr-intro-header-overlay"></div>) : null}
				{this.props.logoSource ? (
					<div className="ptr-intro-header-logo">
						<img src={this.props.logoSource}/>
					</div>
				): null}
				<div className="ptr-intro-header-text">
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

export default IntroHeader;