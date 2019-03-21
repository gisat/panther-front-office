import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import Input from "../../../components/common/atoms/Input/Input";

class InputDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="ptr-docs-panel-content">
				<div className="ptr-docs-panel-section">
					<h2>Basic text</h2>
					<Input/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Basic text with deafult value</h2>
					<Input
						value="Strawberry"
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Basic text with placeholder</h2>
					<Input
						placeholder="Placeholder"
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Basic text disabled</h2>
					<Input
						disabled
						value="Strawberry"
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Multiline text</h2>
					<Input
						multiline
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Multiline text with value</h2>
					<Input
						multiline
						value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Multiline text disabled</h2>
					<Input
						disabled
						multiline
						value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(InputDoc);