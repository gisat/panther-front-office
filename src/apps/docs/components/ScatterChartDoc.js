import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import HoverHandler from "../../../components/common/HoverHandler/HoverHandler";
import ScatterChart from "../../../components/common/charts/ScatterChart/ScatterChart";

class ScatterChartDoc extends React.PureComponent {
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
					<p></p>
					<HoverHandler>
						<ScatterChart
							key="scatter-doc-basic"
						/>
					</HoverHandler>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(ScatterChartDoc);