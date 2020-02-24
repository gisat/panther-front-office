import React from 'react';

import {HoverHandler} from "@gisatcz/ptr-core";
import {SankeyChart} from "@gisatcz/ptr-charts";
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";

// import sample_4 from "../../../mockData/asterChart/sample_4";
import sample_1 from "../../../mockData/sankeyChart/sample_1.json";
// import sample_30 from "../../../mockData/asterChart/sample_30";

class SankeyChartDocs extends React.PureComponent {
	render() {
		return (
			<Page title="Sankey chart">
				<div className="ptr-docs-visualizations-intro-example" style={{maxWidth: '50rem'}}>
					<HoverHandler>
						<SankeyChart
							key="typical-example"
							data={sample_1}

							nodeColorSourcePath="color"
							linkColorSourcePath="color"
							linkNameSourcePath="name"
							linkValueSourcePath="value"
							keySourcePath="key"
							nodeNameSourcePath="id"
							nodeValueSourcePath="value"
							nodeHoverNameSourcePath="name"
							nodeHoverValueSourcePath="hoverValue"
							// gradientLinks
							width={50}
							height={40}
							yOptions={{
								// name: 'Node title',
								unit: 'm2'
							}}
						/>
					</HoverHandler>
				</div>
			</Page>
		);
	}
}

export default SankeyChartDocs;
