import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './style.css';

class PucsClimateFitIntroFooter extends React.PureComponent {

	static propTypes = {
	};

	render() {
		return (
			<div className="ptr-pucs-intro-footer">
				<div className="ptr-pucs-intro-footer-content">
					<div className="ptr-pucs-intro-footer-flag">{this.renderEuFlag()}</div>
					<p className="ptr-pucs-intro-footer-text">Climate-fit.city is developed as part of the PUCS project, which has received funding from the European Union’s H2020 Research and Innovation Programme under Grant Agreement No. 73004</p>
				</div>
			</div>
		);
	}

	renderEuFlag(){
		return (
			<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" width="54" height="36">
				<desc>European flag</desc>
				<defs>
					<g id="s">
						<g id="c">
							<path id="t" d="M0,0v1h0.5z" transform="translate(0,-1)rotate(18)" />
							<use xlinkHref="#t" transform="scale(-1,1)" />
						</g>
						<g id="a">
							<use xlinkHref="#c" transform="rotate(72)" />
							<use xlinkHref="#c" transform="rotate(144)" />
						</g>
						<use xlinkHref="#a" transform="scale(-1,1)" />
					</g>
				</defs>
				<rect fill="#039" width="54" height="36" />
				<g fill="#fc0" transform="scale(2)translate(13.5,9)">
					<use xlinkHref="#s" y="-6" />
					<use xlinkHref="#s" y="6" />
					<g id="l">
						<use xlinkHref="#s" x="-6" />
						<use xlinkHref="#s" transform="rotate(150)translate(0,6)rotate(66)" />
						<use xlinkHref="#s" transform="rotate(120)translate(0,6)rotate(24)" />
						<use xlinkHref="#s" transform="rotate(60)translate(0,6)rotate(12)" />
						<use xlinkHref="#s" transform="rotate(30)translate(0,6)rotate(42)" />
					</g>
					<use xlinkHref="#l" transform="scale(-1,1)" />
				</g>
			</svg>
		);
	}
}

export default PucsClimateFitIntroFooter;