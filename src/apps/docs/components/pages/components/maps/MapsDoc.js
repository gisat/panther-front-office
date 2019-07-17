import React from 'react';
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";
import WorldWindMap from "../../../../../../components/common/maps/WorldWindMap/presentation";
import layersHelper from '../../../../../../components/common/maps/WorldWindMap/layers/helpers';
import PresentationMapWithControls from "../../../../../../components/common/maps/PresentationMapWithControls";
import MapControls from "../../../../../../components/common/maps/MapControls/presentation";

class MapsDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Maps">
				<div style={{height: 500}}>
					<PresentationMapWithControls
						map={(<WorldWindMap
							backgroundLayer={layersHelper.getLayerByType('wikimedia')}
							view={{
								center: {
									lat: 50,
									lon: 15
								},
								boxRange: 1000000
							}}
						/>)}
						controls={(<MapControls/>)}
					/>
				</div>
			</Page>
		);
	}
}

export default MapsDoc;