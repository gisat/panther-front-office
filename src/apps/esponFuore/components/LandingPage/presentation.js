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
							<h1>Functional Urban Areas tool</h1>
							<p>This web tool is the main outcome of the ESPON FUORE project. It presents the data, indicators and knowledge related to Functional Urban Areas and Regions in Europe. The web tool integrates the new ESPON OLAP cube functionalities and provides an unique opportunity to benchmark and analyse the current situation and recent trends in functional urban areas and other functional regions in Europe. The web tool provides a wide range of analytical functionalities, including advanced filtering and benchmarking via interactive maps and graphs.</p>
							<p>Policy decisions and actions reach beyond administrative borders. This means geographies for policy making are not aligned with the geographies affected. Policy-making using functional areas should overcome these challenges.</p>
							<p>In order to improve the relevance, efficiency and effectiveness of the policy making and implementation process regarding functional areas, it is essential to have data, indicators and analysis tools that can help to better understand the drivers for growth and inclusive social development in these areas across Europe. By now significant data gaps exist to be able to understand their contribution to polycentric and balanced territorial development. The results of this project, as presented in this web tool, should help to fill the existing data gaps, complement the work of Eurostat, OECD and DG Joint Research Center in this field and facilitate policy debates at various levels, for instance within Urban Agenda for the EU Partnership on Sustainable Use of Land.</p>
							<div className="esponFuore-landing-page-links">
								<div className="bottom-link"><a href="https://www.espon.eu/functional-urban-areas-tool" target="_blank">Project information</a></div>
								{/*<div className="bottom-link"><a href="#" target="_blank">Guidance materials</a></div>*/}
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

