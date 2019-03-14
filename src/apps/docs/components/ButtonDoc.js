import React from 'react';
import {withNamespaces} from "react-i18next";

import Button from "../../../components/common/atoms/Button";

class ButtonDoc extends React.PureComponent {
	render() {
		return (
			<div className="ptr-docs-panel-content">
				<Button secondary>Test</Button>
			</div>
		);
	}
}

export default withNamespaces()(ButtonDoc);