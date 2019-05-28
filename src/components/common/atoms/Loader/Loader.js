import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Names from "../../../../constants/Names";

import './Loader.css';

class Loader extends React.PureComponent {

	static propTypes = {
		progress: PropTypes.number,
		transparent: PropTypes.bool,
		blackandwhite: PropTypes.bool,
		small: PropTypes.bool
	};

	render() {
		let screenClasses = classNames("loading-screen", {
			transparent: this.props.transparent
		});

		let containerClasses = classNames("a-loader-container", {
			blackandwhite: this.props.blackandwhite,
			small: this.props.small
		});

		return (
			<div className={screenClasses}>
				<div className="loading-screen-content-wrap">
					<div className="loading-screen-content">
						<div className={containerClasses}>
							<i className="i1"></i>
							<i className="i2"></i>
							<i className="i3"></i>
							<i className="i4"></i>
							{this.props.progress ? (<div className="a-loader-progress">{this.props.progress} %</div>) : null}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Loader;