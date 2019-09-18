import React from 'react';
import {withNamespaces} from "react-i18next";

import Page, {
	SyntaxHighlighter
} from '../../../Page';

class MapViewDoc extends React.PureComponent {
	
	render() {
		return (
			<Page title="Map view">
				<p>Universal framework-agnostic representation of map view (what part of the world is visible on the map and how).</p>{/* todo */}
				<SyntaxHighlighter language="javascript">
					{
`{
	center: {
		lat: 50.1,
		lon: 14.5
	},
	boxRange: 100000,
	roll: 0,
	tilt: 0,
	heading: 0,
	elevationExaggeration: 0
}`
					}
				</SyntaxHighlighter>
				
			</Page>
		);
	}
}

export default withNamespaces()(MapViewDoc);