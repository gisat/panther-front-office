import React from 'react';
import _ from 'lodash';

import ChartSet from '../../../../../components/common/charts/ChartSet';
// import UnSeeaCharts from "../Charts/UnSeeaCharts";
import UnSeeaCharts from "../Charts/UnSeeaChartsTrees";
import urbantepLogo from "../../../assets/img/logo_tep_urban.png";
import ninaLogo from "../../../assets/img/eeanina.png";
import "./style.scss";

export default () => {
	return (
		<div className="ptr-un-seea-infopanel">
			{/* header */}
			<div className="un-seea-header">
				<div style={{display:'flex'}}>
					<div style={{flex: '0 0 58px'}}>
						<a href="https://urban-tep.eu/" target="_blank">
							<img src={urbantepLogo} className='logo-urbantep' />
						</a>
					</div>
					<div className="ptr-un-seea-app-title">
						URBAN EEA
						<div className="ptr-un-seea-app-title-subscript">
							powered by Urban Tep
						</div>
					</div>
				</div>
				<div className='logo-wrapper'>
					<a href="https://www.nina.no/english/Fields-of-research/Projects/Urban-EEA" target="_blank">
						<img src={ninaLogo} className='logo-nina' />
					</a>
				</div>
			</div>

			{/* charts */}
			<div style={{flex: '1 0 auto'}}>
				<ChartSet
					setKey="unSeeaTreesCharts"
				>
					<UnSeeaCharts/>
				</ChartSet>
			</div>
		</div>
	)
};

