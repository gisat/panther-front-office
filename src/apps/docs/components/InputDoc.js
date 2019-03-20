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
					<h2>Basic</h2>
					<Input/>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(InputDoc);