import React from 'react';
import PropTypes from 'prop-types';

import methodology from "../../assets/img/methodology.png";
import esponLogoFull from '../../assets/img/espon-logo-full.png';
import gisatLogo from '../../assets/img/gisat-logo.png';
import randbeeLogo from '../../assets/img/Randbee_logo.png';
import uabLogo from '../../assets/img/UAB_logo.png';
import unigeLogo from '../../assets/img/UNIGE_logo.png';
import './style.scss';
import ScopesList from "./ScopesList";
import {Link, NavLink} from "react-router-dom";
import Button from "../../../../components/common/atoms/Button";

class LandingPage extends React.PureComponent {

	render() {
		return (
			<div className="esponFuore-landing-page">
				<div>
					<div className="esponFuore-landing-page-intro">
						<div className="esponFuore-landing-page-logo">
							<img src={esponLogoFull}/>
						</div>
						<div className="esponFuore-landing-page-text">
							<h1>Functional Urban Areas and Other Regions - Analytical Tool</h1>
							<p>Policy decisions and actions reach beyond administrative borders. This means geographies for policy making are not aligned with the geographies affected. Policy-making using functional areas should overcome these challenges. In order to improve the relevance, efficiency and effectiveness of the policy making and implementation process regarding functional areas, it is essential to have data, indicators and analytical tools that can help to better understand the drivers for growth and facilitate policy debates at various levels.</p>
							<p className="esponFuore-info-paragraph">The FUORE Webtool is providing estimated indicators by Functional Urban Areas and other functional regions in Europe. Therefore, the figures shown by the FUORE webtool cannot replace official statistics whenever they exist.</p>
							<div className="esponFuore-cta-container">
								Start by selecting a region type below or&nbsp;<NavLink to="#about">read more about the project</NavLink>.
							</div>
						</div>
					</div>
					<ScopesList/>
					<div id="about" className="esponFuore-landing-page-about">
						<p>This web tool is the main outcome of the ESPON FUORE project. It presents the data, indicators and knowledge related to Functional Urban Areas and Regions in Europe and provides an unique opportunity to analyze the current situation and recent trends in functional regions in Europe. The tool offers a wide range of analytical functionalities, including advanced filtering and benchmarking via interactive maps and graphs.</p>
						<p>The estimation of indicators is based on a <a href={methodology} target="_blank">complex methodology</a> of of disaggregation of NUTS-based indicators by means of different ancillary datasets and the aggregation back to the different functional regions.</p>
						<h3 id="links">Learn more</h3>

							<div className="bottom-link"><NavLink to={"/delineation-methods"}>Delineation methods</NavLink></div>
							<div className="bottom-link"><a href="https://www.espon.eu/sites/default/files/attachments/ESPON%20FUORE%20-%20Draft%20Final%20Report.pdf" target="_blank">ESPON FUORE Draft Final Report</a></div>
							<div className="bottom-link"><a href="https://www.espon.eu/functional-urban-areas-tool" target="_blank">Project information</a></div>
							<div className="bottom-link"><a href="https://www.youtube.com/playlist?list=PL49pQPEGrQRFbq4gOeoolkqBDNdY8d_Ms" target="_blank">Video tutorial</a></div>
							<div className="bottom-link"><a href="https://212.24.101.53/user/fuore_advanced_user/notebooks/espon_analytical_webtool.ipynb" target="_blank">Custom disaggregation tool</a></div>


					</div>
					<div className="esponFuore-landing-page-footer">
						<div>
							<a title="ESPON | espon.eu" href="https://espon.eu" target="_blank"><img src={esponLogoFull}/></a>
							<a title="GISAT | gisat.cz" href="http://gisat.cz/content/en" target="_blank"><img src={gisatLogo}/></a>
							<a title="Universitat Autònoma de Barcelona | uab.cat" href="https://www.uab.cat/en/" target="_blank"><img src={uabLogo}/></a>
							<a title="Université de Genève | unige.ch" href="https://www.unige.ch/gedt/en/home/gedt-presentation/" target="_blank"><img src={unigeLogo}/></a>
							<a title="Randbee Consultants: Data Science & Visualization | randbee.com" href="https://randbee.com/" target="_blank"><img src={randbeeLogo}/></a>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

export default LandingPage;

