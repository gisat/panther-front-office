import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import sample_4 from "../../../mockData/asterChart/sample_4";
import sample_7 from "../../../mockData/asterChart/sample_7";
import sample_30 from "../../../mockData/asterChart/sample_30";
import HoverHandler from "../../../../../../components/common/HoverHandler/HoverHandler";

import Page from "../../../Page";
import ResizableContainer from "../../../ResizableContainer/ResizableContainer";

class AsterChartDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Aster chart">
				<HoverHandler>
					<ResizableContainer>
						<AsterChart
							key="aster-doc-7"
							data={sample_7}

							colorSourcePath="color"
							keySourcePath="key"
							nameSourcePath="data.name"
							valueSourcePath="data.someStrangeValue"

							forceMinimum={0}
							forceMaximum={2000}

							grid
							gridGapMin={30}
							gridStepsMax={5}
							gridValues

							radials
							radialsLabels

							legend
						/>
					</ResizableContainer>
				</HoverHandler>

				<HoverHandler>
					<ResizableContainer>
						<AsterChart
							key="aster-doc-30"
							data={sample_30}

							colorSourcePath="color"
							keySourcePath="key"
							nameSourcePath="data.name"
							valueSourcePath="data.someStrangeValue"

							forceMinimum={0}
							forceMaximum={100}

							relative

							legend
						/>
					</ResizableContainer>
				</HoverHandler>
					{/*<div className="ptr-docs-panel-section">*/}
						{/*<h2>Basic settings - 4 indicators, random color</h2>*/}
						{/*<p>Max and min from values, no legend.</p>*/}
						{/*<HoverHandler>*/}
							{/*<AsterChart*/}
								{/*key="aster-doc-basic"*/}
								{/*data={sample_4}*/}

								{/*keySourcePath="key"*/}
								{/*nameSourcePath="data.name"*/}
								{/*valueSourcePath="data.someStrangeValue"*/}

								{/*grid*/}
							{/*/>*/}
						{/*</HoverHandler>*/}
					{/*</div>*/}


					{/*<div className="ptr-docs-panel-section">*/}
						{/*<h2>30 indicators, sorted</h2>*/}
						{/*<p>Legend in the bottom, without scale captions</p>*/}
						{/*<HoverHandler>*/}
							{/*<AsterChart*/}
								{/*key="aster-doc-30"*/}
								{/*data={sample_30}*/}

								{/*colorSourcePath="color"*/}
								{/*keySourcePath="key"*/}
								{/*nameSourcePath="data.name"*/}
								{/*valueSourcePath="data.someStrangeValue"*/}
								{/*sorting={[["data.someStrangeValue", "desc"]]}*/}

								{/*forceMinimum={0}*/}
								{/*forceMaximum={100}*/}

								{/*relative*/}

								{/*axis*/}
								{/*grid*/}
								{/*radials={{*/}
									{/*captions: true*/}
								{/*}}*/}

								{/*legend*/}
							{/*/>*/}
						{/*</HoverHandler>*/}
					{/*</div>*/}
			</Page>
		);
	}
}

export default withNamespaces()(AsterChartDoc);