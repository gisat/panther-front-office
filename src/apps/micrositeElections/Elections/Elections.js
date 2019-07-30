import React from 'react';
import PropTypes from "prop-types";

import './style.scss';
import HoverHandler from "../../../components/common/HoverHandler/HoverHandler";
import ColumnChart from "../../../components/common/charts/ColumnChart/ColumnChart";
import ChartWrapper from "../../../components/common/charts/ChartWrapper/ChartWrapper";
import WorldWindMap from "../../../components/common/maps/Deprecated_WorldWindMap/presentation";


class Elections extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		layers: PropTypes.array,
		navigator: PropTypes.object
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
							xValues
							yValues
							yGridlines
							withoutYbaseline
							xValuesSize={8}
							yValuesSize={2}
						/>
					</ChartWrapper>
					<h3>
						Volební účast [%]
					</h3>
					<div style={{height:'300px', width: '400px'}}>
						<WorldWindMap 
							navigator={this.props.navigator}
							layers={this.props.layers}
							elevationModel={null}
							/>
						</div>
				</HoverHandler>
			</div>
		);
	}
}

export default Elections;