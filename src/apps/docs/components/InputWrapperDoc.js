import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import InputWrapper from "../../../components/common/atoms/InputWrapper/InputWrapper";

class InputWrapperDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="ptr-docs-panel-content">
				<div className="ptr-docs-panel-section">
					<h2>Basic</h2>
					<InputWrapper/>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(InputWrapperDoc);