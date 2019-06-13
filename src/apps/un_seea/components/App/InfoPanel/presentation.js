import React from 'react';
import _ from 'lodash';

import ChartSet from '../../../../../components/common/charts/ChartSet';
import UnSeeaCharts from "../Charts/UnSeeaCharts";
import logo from "../../../assets/img/eeanina.png";

export default () => {
	return (<div style={{display: "flex",flexFlow: "column"}}>
		{/* header */}
		<div className="un-seea-header">
			<div className="un-seea-home" className='logo-wrapper'>
				<img src={logo} className='logo' />
			</div>
		</div>

		{/* charts */}
		<ChartSet
			setKey="unSeeaCharts"
		>
			<UnSeeaCharts/>
		</ChartSet>
	</div>)
};

