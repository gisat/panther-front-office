import React from 'react';
import PropTypes from 'prop-types';

import methodology from "../../assets/img/methodology.png";
import esponLogoFull from '../../assets/img/espon-logo-full.png';
import './style.scss';
import EsponHeader from "../EsponHeader";
import ScopesList from "./ScopesList";
import {Link, NavLink} from "react-router-dom";
import Footer from "../Footer";

class LandingPage extends React.PureComponent {

	render() {
		return (
			<div className="esponFuore-landing-page">
                <EsponHeader/>
				<div className="esponFuore-landing-page-content">
					<div className="esponFuore-landing-page-intro">
						<div className="esponFuore-landing-page-logo">
							<img src={esponLogoFull}/>
						</div>
						<div className="esponFuore-landing-page-text">
							<h1>FUORE Tool</h1>
							<p>Welcome to the FUORE web tool! Explore hundreds of estimated demographic and socioeconomic time series indicators reported by nine types of functional regions in Europe, selected from <NavLink to={"/delineation-methods"}>various sources</NavLink>. Analyse, filter and benchmark them by means of illustrative maps and charts. Add and estimate your own indicator by means of the <a href="https://fuore.espon.eu/user/fuore_advanced_user/notebooks/notebooks/espon_analytical_webtool.ipynb" target="_blank" rel="noopener noreferrer">advanced toolbox</a>.
							</p>
							<div className="esponFuore-info-paragraph">
								<p>The FUORE webtool is providing estimated indicators by Functional Urban Areas and other functional regions in Europe. Therefore, the figures shown by the FUORE webtool cannot replace official statistics whenever they exist.</p>

								<p>The estimated values are based on a <a href={methodology} target="_blank" rel="noopener noreferrer">complex methodology</a> of disaggregation of NUTS-based indicators by means of different ancillary datasets and the aggregation back to the different functional regions.</p>
							</div>
							<div className="esponFuore-cta-container">
								Start by selecting a region type below or&nbsp;<NavLink to="#about">read more about the project</NavLink>.
							</div>
						</div>
					</div>
					<ScopesList/>
					<div id="about" className="esponFuore-landing-page-about">
						<p>This web tool is the main outcome of the <a href="https://www.espon.eu/functional-urban-areas-tool" target="_blank" rel="noopener noreferrer">ESPON FUORE project</a>. For further information, see the links below.
						</p>

						<h3 id="links">Learn more</h3>

							<div className="bottom-link"><NavLink to={"/delineation-methods"}>Delineation methods</NavLink></div>
							<div className="bottom-link"><a href="https://www.espon.eu/sites/default/files/attachments/Functional%20Urban%20Areas%20and%20Regions%20in%20Europe%20-%20Final%20Report.pdf" target="_blank" rel="noopener noreferrer">ESPON FUORE Final Report</a></div>
							<div className="bottom-link"><a href="https://www.youtube.com/playlist?list=PL49pQPEGrQRFbq4gOeoolkqBDNdY8d_Ms" target="_blank" rel="noopener noreferrer">Video tutorials</a></div>
						<h3>Advanced</h3>
							<div className="bottom-link"><a href="https://fuore.espon.eu/user/fuore_advanced_user/notebooks/notebooks/espon_analytical_webtool.ipynb" target="_blank" rel="noopener noreferrer">Custom disaggregation tool</a></div>
					</div>
					<Footer/>
				</div>
			</div>
		);
	}

}

export default LandingPage;

