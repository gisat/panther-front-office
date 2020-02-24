import React from 'react';
import {withNamespaces} from "react-i18next";
import {FadeIn} from '@gisatcz/ptr-atoms';

import Page from '../../../Page';

class FadeInDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="FadeIn">
				<div className="ptr-docs-panel-section">
					<h2>Basic usage</h2>
					<FadeIn>
						<p>Item 1</p>
						<p>Item 2</p>
						<p>Item 3</p>
					</FadeIn>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Vertical with custom duration and delay</h2>
					<FadeIn
						duration={1000}
						delay={500}
						vertical
					>
						<p>Item 1</p>
						<p>Item 2</p>
						<p>Item 3</p>
					</FadeIn>
				</div>
			</Page>
		);
	}
}

export default withNamespaces()(FadeInDoc);