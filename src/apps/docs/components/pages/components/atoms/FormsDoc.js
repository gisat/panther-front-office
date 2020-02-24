import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import Page from '../../../Page';
import {Input} from '@gisatcz/ptr-atoms';
import InputWrapper, {InputWrapperInfo} from "../../../../../../components/common/atoms/InputWrapper/InputWrapper";

class FormsDoc extends React.PureComponent {

	render() {
		return (
			<Page title="Forms">
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
				
				
				
				<div className="ptr-docs-panel-section">
					<h2>Basic</h2>
					<InputWrapper
						label="Input"
					>
						<Input
							value="Blueberry"
						/>
					</InputWrapper>
				</div>
				
				<div className="ptr-docs-panel-section">
					<h2>Basic required</h2>
					<InputWrapper
						label="Input"
						required
					>
						<Input
							value="Cranberry"
						/>
					</InputWrapper>
				</div>
				
				<div className="ptr-docs-panel-section">
					<h2>With info</h2>
					<InputWrapper
						label="Input"
						required
					>
						<Input
							value="Cranberry"
						/>
						<InputWrapperInfo>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</InputWrapperInfo>
					</InputWrapper>
				</div>
				
				
				
				
				
				
				
				
			</Page>
		);
	}
}

export default withNamespaces()(FormsDoc);