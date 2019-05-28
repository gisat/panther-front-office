import React from 'react';
import PropTypes from "prop-types";

import './style.scss';
import HoverHandler from "../../../components/common/HoverHandler/HoverHandler";
import ColumnChart from "../../../components/common/charts/ColumnChart/ColumnChart";
import ChartWrapper from "../../../components/common/charts/ChartWrapper/ChartWrapper";


class Elections extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array
	};

	render() {
		return (
			<div className="micrositeElections-page ptr-dark">
				<HoverHandler>
					<ChartWrapper
						title="Volby do Evropského parlamentu 2019"
						subtitle="Celkové výsledky hlasování v České republice v %, zdroj dat: ČSÚ"
					>
					<ColumnChart
						data={this.props.data}
						key="ep_elections_2019"
						keySourcePath="$.ESTRANA"
						colorSourcePath="$.COLOR"
						xSourcePath="$.NAZ_STR"
						ySourcePath="HLASY_STRANA[0].$.PROC_HLASU"
						xCaptions
						yCaptions
						yGridlines
						withoutYbaseline
						xCaptionsSize={130}
						yCaptionsSize={30}
					/>
					</ChartWrapper>
				</HoverHandler>
			</div>
		);
	}
}

export default Elections;