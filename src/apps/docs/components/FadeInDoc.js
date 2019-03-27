import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import FadeIn from "../../../components/common/atoms/FadeIn/FadeIn";

class FadeInDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="ptr-docs-panel-content">
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
			</div>
		);
	}
}

export default withNamespaces()(FadeInDoc);