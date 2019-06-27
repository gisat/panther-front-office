import React from 'react';
import sdgLogo from '../../assets/sdg_logo_white.png';
import sdg11Logo from '../../assets/sdg_11_logo_white.png';

class UtepSdgHeader extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="utep_sdg_11_3_1-header">
				<div className="utep_sdg_11_3_1-top-bar">
					<div className="utep_sdg_11_3_1-title-container">
						<div className="utep_sdg_11_3_1-title">Sustainable Development Goal 11.3.1</div>
						<div className="utep_sdg_11_3_1-subtitle">
							Ratio of land consumption rate to population growth rate | Demonstration&nbsp;in&nbsp;SE&nbsp;Asia
						</div>
					</div>
					<div className="utep_sdg_11_3_1-logos">
						<a className="utep_sdg_11_3_1-logo" title="United Nations | SDG 11 - Cities" href="https://www.un.org/sustainabledevelopment/cities/" target="_blank">
							<img alt="SDG 11" src={sdg11Logo}/>
						</a>
						<a className="utep_sdg_11_3_1-logo" title="United Nations | Sustainable Development Goals" href="https://www.un.org/sustainabledevelopment/" target="_blank">
							<img alt="SDG" src={sdgLogo}/>
						</a>
					</div>
				</div>
				<div className="utep_sdg_11_3_1-description">

				</div>
			</div>
		);
	}
}

export default UtepSdgHeader;

