import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import InputWrapper, {InputWrapperInfo} from "../../../components/common/atoms/InputWrapper/InputWrapper";
import Input from "../../../components/common/atoms/Input/Input";

class InputWrapperDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="ptr-docs-panel-content">
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
			</div>
		);
	}
}

export default withNamespaces()(InputWrapperDoc);