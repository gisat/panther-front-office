import React from 'react';
import PropTypes from 'prop-types';

import esponLogo from './img/espon-logo.png';
import gisatLogo from './img/gisat-logo.png';
import './style.scss';
import ScopesList from "../ScopesList";

class LandingPage extends React.PureComponent {

	render() {
		return (
			<div className="esponFuore-landing-page">
				<div>
					<div className="esponFuore-landing-page-intro">
						<div className="esponFuore-landing-page-logo">
							<img src={esponLogo}/>
						</div>
						<div className="esponFuore-landing-page-text">
							<h1>Functional Urban Areas tool</h1>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam id leo in vitae turpis. Egestas sed sed risus pretium quam. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Congue quisque egestas diam in.</p>
							<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
							<div className="esponFuore-landing-page-links">
								<div className="bottom-link"><a href="https://www.espon.eu/" target="_blank">Project information</a></div>
								<div className="bottom-link"><a href="#" target="_blank">Guidance materials</a></div>
							</div>
						</div>
					</div>
					<ScopesList/>
					<div className="esponFuore-landing-page-footer">
						<a href="https://espon.eu" target="_blank"><img src={esponLogo}/></a>
						<a href="http://gisat.cz/content/en" target="_blank"><img src={gisatLogo}/></a>
					</div>
				</div>
			</div>
		);
	}

}

export default LandingPage;

