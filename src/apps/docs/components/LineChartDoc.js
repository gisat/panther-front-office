import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import LineChart from "../../../components/common/charts/LineChart/LineChart";

import sample_serie_7 from "../../../components/common/charts/mockData/sample_serie_7";

class LineChartDoc extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			width: null
		};
		this.ref = React.createRef();

		this.resize = this.resize.bind(this);
	}

	resize() {
		this.setState({
			width: (window.innerWidth) - 270 // TODO do it better
		})
	}

	componentDidMount() {
		this.resize();
		if (window) window.addEventListener('resize', this.resize, {passive: true}); //todo IE
	}

	render() {
		return (
			<div className="ptr-docs-panel-content" ref={this.ref}>
				<div className="ptr-docs-panel-section">
					<h2>Basic settings</h2>
					<p>Resize window to see responsiveness.</p>
					{React.cloneElement(
						<LineChart
							key="test1"
							data={sample_serie_7}
							serieKeySourcePath="key"
							serieNameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							xTicks
							xGridlines
							xCaptions
							yTicks
							yGridlines
							yCaptions

							xCaptionsSize={50}
						/>, {width: this.state.width})}
				</div>
			</div>
		);
	}
}

export default withNamespaces()(LineChartDoc);