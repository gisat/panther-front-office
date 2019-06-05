import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import AsterChart from "../../../components/common/charts/AsterChart/AsterChart";
import sample_4 from "./mockData/asterChart/sample_4";
import sample_7 from "./mockData/asterChart/sample_7";
import sample_30 from "./mockData/asterChart/sample_30";
import HoverHandler from "../../../components/common/HoverHandler/HoverHandler";

class AsterChartDoc extends React.PureComponent {
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
					<h2>Basic settings - 4 indicators</h2>
					<p>Resize window to see responsiveness.</p>
					<HoverHandler>
						<AsterChart
							key="aster-doc-basic"
							data={sample_4}
							width={this.state.width}
							maxWidth={500}

							colorSourcePath="color"
							keySourcePath="key"
							nameSourcePath="data.name"
							valueSourcePath="data.someStrangeValue"

							grid
						/>
					</HoverHandler>
				</div>
				<div className="ptr-docs-panel-section">
					<h2>7 indicators, force min, max</h2>
					<p>Resize window to see responsiveness.</p>
					<HoverHandler>
						<AsterChart
							key="aster-doc-7"
							data={sample_7}
							width={this.state.width}
							maxWidth={500}

							colorSourcePath="color"
							keySourcePath="key"
							nameSourcePath="data.name"
							valueSourcePath="data.someStrangeValue"

							forceMinimum={0}
							forceMaximum={2000}

							axis
							grid={{
								maxSteps: 5,
								minGap: 30,
								captions: true
							}}
							radials={{
								captions: true
							}}
						/>
					</HoverHandler>
				</div>
				<div className="ptr-docs-panel-section">
					<h2>30 indicators, relative</h2>
					<p>Resize window to see responsiveness.</p>
					<HoverHandler>
						<AsterChart
							key="aster-doc-30"
							data={sample_30}
							width={this.state.width}
							maxWidth={500}

							colorSourcePath="color"
							keySourcePath="key"
							nameSourcePath="data.name"
							valueSourcePath="data.someStrangeValue"

							forceMinimum={0}
							forceMaximum={100}

							relative

							axis
							grid={{
								captions: true
							}}
							radials={{
								captions: true
							}}
						/>
					</HoverHandler>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(AsterChartDoc);