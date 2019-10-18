import React from 'react';
import Truncate from 'react-truncate';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import eeninaLogoFull from '../../../assets/img/eeanina.png';
import gisatLogo from '../../../assets/img/gisat-logo.png';
import urbanTEPLogo from '../../../assets/img/logo_tep_urban.png';
import './style.scss';

import treesThumbnail from '../../../assets/img/trees.png';
import districtsThumbnail from '../../../assets/img/districts.png';
import districtsTwoThumbnail from '../../../assets/img/districts_two.png';

class LandingPage extends React.PureComponent {

	render() {
		const {match} = this.props;
		
		return (
			<div className="unseea-landing-page">
				<div>
					<div className="unseea-landing-page-intro">
						<div className="unseea-landing-page-logo">
							<img src={eeninaLogoFull}/>
						</div>
						<div className="unseea-landing-page-text">
							<h1>URBAN EEA</h1>
							<p>What is the value of urban nature in the Oslo area? Oslo EEA municipal applications maps and values ecosystem services in the Oslo Region, and tests methods for ecosystem accounting at the municipal level.</p>
							<p>The URBAN EEA project conducts research on ecosystem services from urban ecosystems in the Oslo Region, both green spaces in the built area and peri-urban nature areas. The project contributes to research and development on the UNs Experimental Ecosystem Accounting (EEA) and its application to urban areas. URBAN EEA aims to develop ecosystem accounts for the Oslo area providing lessons for other Norwegian municipalities.</p>
							<p>
							Read more: <a href="https://www.nina.no/english/Fields-of-research/Projects/Urban-EEA" target="_blank">https://www.nina.no/english/Fields-of-research/Projects/Urban-EEA</a>
							</p>
						</div>
					</div>

					<div className={'unseea-subapp-list'}>
						<Link to={`${match.path}/districtsSecond`}>
							<div className={'unseea-subapp-card'} style={{backgroundImage: `url(${districtsTwoThumbnail})`}}>
									<div className="unseea-subapp-card-name">
										Districts
									</div>
									<div className="unseea-subapp-card-description">
										<Truncate lines={6}>
											Understanding of the land use management
										</Truncate>
									</div>
								</div>
						</Link>
						
						
						<Link to={`${match.path}/trees`}>
							<div className={'unseea-subapp-card'} style={{backgroundImage: `url(${treesThumbnail})`}}>
								<div className="unseea-subapp-card-name">
									Trees
								</div>
								<div className="unseea-subapp-card-description">
									<Truncate lines={6}>
										Analysis of the individual trees
									</Truncate>
								</div>
							</div>
						</Link>

						<Link to={`${match.path}/districts`}>
							<div className={'unseea-subapp-card'} style={{backgroundImage: `url(${districtsThumbnail})`}}>
									<div className="unseea-subapp-card-name">
										Trees (districts)
									</div>
									<div className="unseea-subapp-card-description">
										<Truncate lines={6}>
											District tree analysis
										</Truncate>
									</div>
								</div>
						</Link>
					</div>

					<div className="unseea-landing-page-footer">
						<a href="https://www.nina.no/english/Fields-of-research/Projects/Urban-EEA" target="_blank">
							<img src={eeninaLogoFull}/>
						</a>
						<a href="http://gisat.cz/content/en" target="_blank">
							<img src={gisatLogo}/>
						</a>
						<a href="https://urban-tep.eu/" className={"logo-utep"} target="_blank">
							<img src={urbanTEPLogo}/>
						</a>
					</div>
				</div>
			</div>
		);
	}

}

export default LandingPage;

