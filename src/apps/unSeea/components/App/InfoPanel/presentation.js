import React from 'react';

import UnSeeaChartsTrees from "../Charts/UnSeeaChartsTrees";
import UnSeeaChartsDistricts from "../Charts/UnSeeaChartsDistricts";
import UnSeeaChartsDistrictsSecond from "../Charts/UnSeeaChartsDistrictsSecond";
import urbantepLogo from "../../../assets/img/logo_tep_urban.png";
import ninaLogo from "../../../assets/img/eeanina.png";
import "./style.scss";

import {ChartSet} from '@gisatcz/ptr-charts';
import {connects} from '@gisatcz/ptr-state';

const ConnectedChartSet = connects.ChartSet(ChartSet);

const renderChartSet = (chartSetKey, activeAttributeKey) => {
	switch(chartSetKey) {
		case 'unSeeaTreesCharts':
			return <UnSeeaChartsTrees spatialIdKey={activeAttributeKey}/>
		case 'unSeeaDistrictsCharts':
			return <UnSeeaChartsDistricts spatialIdKey={activeAttributeKey}/>
		case 'unSeeaDistrictsSecondCharts':
			return <UnSeeaChartsDistrictsSecond spatialIdKey={activeAttributeKey}/>
	}
}

export default (props) => {

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
				<ConnectedChartSet
					setKey={props.activeChartSet}
				>
					{renderChartSet(props.activeChartSet, props.activeAttributeKey)}
				</ConnectedChartSet>
			</div>
		</div>
	)
};

