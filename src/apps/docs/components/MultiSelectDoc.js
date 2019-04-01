import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import MultiSelect from "../../../components/common/atoms/Select/MultiSelect";

class MultiSelectDoc extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<div className="ptr-docs-panel-content">
				<div className="ptr-docs-panel-section">
					<h2>Basic multiselect</h2>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(MultiSelectDoc);