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
				<h2>Basic text</h2>
				<div className="ptr-docs-panel-section">
					<Input/>
				</div>

				<h2>Basic text with deafult value</h2>
				<div className="ptr-docs-panel-section">
					<Input
						value="Strawberry"
					/>
				</div>

				<h2>Basic text with placeholder</h2>
				<div className="ptr-docs-panel-section">
					<Input
						placeholder="Placeholder"
					/>
				</div>

				<h2>Basic text disabled</h2>
				<div className="ptr-docs-panel-section">
					<Input
						disabled
						value="Strawberry"
					/>
				</div>

				<h2>Basic text</h2>
				<div className="ptr-docs-panel-section inverted">
					<Input inverted/>
				</div>

				<h2>Basic text with deafult value</h2>
				<div className="ptr-docs-panel-section inverted">
					<Input
						inverted
						value="Strawberry"
					/>
				</div>

				<h2>Basic text with placeholder</h2>
				<div className="ptr-docs-panel-section inverted">
					<Input
						inverted
						placeholder="Placeholder"
					/>
				</div>

				<h2>Basic text disabled</h2>
				<div className="ptr-docs-panel-section inverted">
					<Input
						disabled
						inverted
						value="Strawberry"
					/>
				</div>

				<h2>Multiline text</h2>
				<div className="ptr-docs-panel-section">
					<Input
						multiline
					/>
				</div>

				<h2>Multiline text with value</h2>
				<div className="ptr-docs-panel-section">
					<Input
						multiline
						value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
					/>
				</div>

				<h2>Multiline text disabled</h2>
				<div className="ptr-docs-panel-section">
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