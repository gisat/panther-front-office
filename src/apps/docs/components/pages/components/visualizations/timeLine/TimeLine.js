import React from 'react';
import { Link } from 'react-router-dom';
import Page, {
	ComponentPropsTable,
	DocsToDo,
	InlineCodeHighlighter,
	LightDarkBlock,
	SyntaxHighlighter
} from "../../../../Page";
// import serie_10 from "../../../../mockData/scatterChart/serie_10";
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";
// import ColumnChart from "../../../../../../../components/common/charts/ColumnChart/ColumnChart";
// import ResizableContainer from "../../../../ResizableContainer/ResizableContainer";

class Timeline extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Timeline">
				<div className="ptr-docs-visualizations-intro-example timeline">
					<HoverHandler>
						timeline
					</HoverHandler>
				</div>
			</Page>
		);
	}
}

export default Timeline;