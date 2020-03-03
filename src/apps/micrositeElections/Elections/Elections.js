import React from 'react';
import PropTypes from "prop-types";

import './style.scss';
import {HoverHandler} from "@gisatcz/ptr-core";
import {ColumnChart, ChartWrapper} from '@gisatcz/ptr-charts';
import {Deprecated_WorldWindMapPresentation} from '@gisatcz/ptr-deprecated';


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
							nameSourcePath="$.NAZ_STR"
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
						<Deprecated_WorldWindMapPresentation
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