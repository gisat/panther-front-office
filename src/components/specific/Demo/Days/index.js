import React from 'react';
import { withNamespaces } from 'react-i18next';

class Days extends React.PureComponent {
	render() {
		const t = this.props.t;
		return (
			<div>
				{t("days.monday") /* use value from default translation file*/} <br/>
				{t("days.tuesday", "Tuesday") /* Second parameter is default value used if there is no value translation */} <br/>
				{t("days.wednesday")} <br/>
			</div>
		);
	}
}

export default withNamespaces()(Days);