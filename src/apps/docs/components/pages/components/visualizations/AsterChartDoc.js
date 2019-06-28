import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import sample_4 from "../../../mockData/asterChart/sample_4";
import sample_7 from "../../../mockData/asterChart/sample_7";
import sample_30 from "../../../mockData/asterChart/sample_30";
import HoverHandler from "../../../../../../components/common/HoverHandler/HoverHandler";

import Page from "../../../Page";

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
			<Page title="Aster chart">
				<div ref={this.ref}>
					<div className="ptr-docs-panel-section">
						<h2>Basic settings - 4 indicators, random color</h2>
						<p>Max and min from values, no legend.</p>
						<HoverHandler>
							<AsterChart
								key="aster-doc-basic"
								data={sample_4}
								width={this.state.width}
								maxWidth={500}
	
								keySourcePath="key"
								nameSourcePath="data.name"
								valueSourcePath="data.someStrangeValue"
	
								grid
								legend
							/>
						</HoverHandler>
					</div>
					<div className="ptr-docs-panel-section">
						<h2>7 indicators, specified color</h2>
						<p>Grid with captions and radials, adjusted number of gridlines and gap between gridlines, maxWidth, force maximum and minimum</p>
						<HoverHandler>
							<AsterChart
								key="aster-doc-7"
								data={sample_7}
								width={this.state.width}
								maxWidth={400}
	
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
								radials
	
								legend={{
									position: 'bottom'
								}}
							/>
						</HoverHandler>
					</div>
	
					<div className="ptr-docs-panel-section">
						<h2>30 indicators, relative</h2>
						<p>Legend with numbers on right</p>
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
	
								legend={{
									position: "right"
								}}
							/>
						</HoverHandler>
					</div>
	
					<div className="ptr-docs-panel-section">
						<h2>30 indicators, sorted</h2>
						<p>Legend in the bottom, without scale captions</p>
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
								sorting={[["data.someStrangeValue", "desc"]]}
	
								forceMinimum={0}
								forceMaximum={100}
	
								relative
	
								axis
								grid
								radials={{
									captions: true
								}}
	
								legend={{
									position: "bottom"
								}}
							/>
						</HoverHandler>
					</div>
				</div>
			</Page>
		);
	}
}

export default withNamespaces()(AsterChartDoc);