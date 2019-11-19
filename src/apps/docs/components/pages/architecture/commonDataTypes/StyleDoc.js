import React from 'react';
import {withNamespaces} from "react-i18next";

import Page, {
	SyntaxHighlighter
} from '../../../Page';

class StyleDoc extends React.PureComponent {

	render() {
		return (
			<Page title="Styles">
				<p>Styles are for styling. </p>{/* todo */}
				<SyntaxHighlighter language="javascript">
					{
`{
	key: '3a188ace-94d2-46e5-86c8-684172bd2af4',
	data: {
		nameInternal: '',
		nameDisplay: '',
		description: '',
		source: 'geoserver|definition',
		nameGeoserver: '',
		definition: {
			rules: [
				{
					filter: {
						['and'|'or']: [
							{
								featureType: 'Point|MultiPolygon|pixel|...',
								attributeKey: '4a188ace-94d2-46e5-86c8-684172bd2af5',
								attributeInterval: [-10.12,11.45] | [null, 11.45],
								attributeValue: 'Prague' | 7 | ...
								...
							}
						], 
						featureType: 'Point|MultiPolygon|pixel|...',
						attributeKey: '4a188ace-94d2-46e5-86c8-684172bd2af5',
						attributeInterval: [-10.12,11.45] | [null, 11.45],
						attributeValue: 'Prague' | 7 | ...
						...
					},
					styles: [
						{
							attributeKey: '54fba0c3-889b-4a26-bda9-5cf9235517d0',
							attributeClasses: [
								{
									interval: [7, 8]
									intervalBounds: [true, false] // 7 is included, 8 not
									fill: '#ff00ee'
								}, {
									
								}
							]
						}
					]
				}
			]
		}
	}
}`
					}
				</SyntaxHighlighter>

				<SyntaxHighlighter language="javascript">
					{
						`{
	key: 'szdc-zonal-classification-example',
	data: {
		nameInternal: '',
		nameDisplay: '',
		description: '',
		source: 'definition',
		nameGeoserver: '',
		definition: {
			rules: [
				{
					styles: [
						{
							shape: 'circle-with-arrow'
						}, {
							attributeKey: 'vertical-movement',
							attributeClasses: [
								{
									interval: [0,1],
									fill: '#ff00ee'
								}, {
									interval: [1,2],
									fill: '#ffaaee'
								}
							]
						}, {
							attributeKey: 'standard-deviation',
							attributeScale: {
								volume: {
									inputInterval: [0,1], // optional
									outputInterval: [5,1000],
									outputUnits: 'sqm'
								}
							}
						}, {
							attributeKey: 'east-west-movement',
							attributeScale: {
								arrowLength: {
									inputTransformation: ['abs'],
									inputInterval: [0,50],
									outputInterval: [10,500],
									outputUnits: 'm'
								}
							}
						}
					]
				}
			]
		}
	}
}`
					}
				</SyntaxHighlighter>
			</Page>
		);
	}
}

export default withNamespaces()(StyleDoc);