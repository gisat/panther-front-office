import React from 'react';
import PropTypes from 'prop-types';

import esponLogo from '../../assets/img/espon-logo.png';
import esponLogoFull from '../../assets/img/espon-logo-full.png';
import gisatLogo from '../../assets/img/gisat-logo.png';
import './style.scss';
import ScopesList from "./ScopesList";

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
							<h1>Functional Urban Areas and Other Regions - Analytical Tool</h1>
							<p>This web tool is the main outcome of the ESPON FUORE project. It presents the data, indicators and knowledge related to Functional Urban Areas and Regions in Europe and provides an unique opportunity to analyze the current situation and recent trends in functional regions in Europe. The tool offers a wide range of analytical functionalities, including advanced filtering and benchmarking via interactive maps and graphs</p>
							<p>Policy decisions and actions reach beyond administrative borders. This means geographies for policy making are not aligned with the geographies affected. Policy-making using functional areas should overcome these challenges. In order to improve the relevance, efficiency and effectiveness of the policy making and implementation process regarding functional areas, it is essential to have data, indicators and analytical tools that can help to better understand the drivers for growth and facilitate policy debates at various levels.</p>
							<p><b>Please note that this is the alpha version of the webtool, so it will be further developed.
								Also, the figures presented are currently under validation. Therefore, they should be considered as draft results of the project and may be further adjusted.</b></p>
							<div className="esponFuore-landing-page-links">
								<div className="bottom-link"><a href="https://www.espon.eu/functional-urban-areas-tool" target="_blank">Project information</a></div>
								<div className="bottom-link"><a href="#">Custom disaggregation</a></div>
							</div>
						</div>
					</div>
					<ScopesList/>
					<div className="esponFuore-landing-page-footer">
						<a href="https://espon.eu" target="_blank"><img src={esponLogoFull}/></a>
						<a href="http://gisat.cz/content/en" target="_blank"><img src={gisatLogo}/></a>
					</div>
				</div>
			</div>
		);
	}

}

export default LandingPage;

