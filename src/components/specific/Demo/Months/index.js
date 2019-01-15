import React from 'react';
import { withNamespaces } from 'react-i18next';

import cz from './locales/cz.json';
import en from './locales/en.json';

class Months extends React.PureComponent {
	constructor(props){
		super(props);

		// keep existing and add ones
		this.props.i18n.addResourceBundle('cz', 'translation', {months: cz}, true, false);
		this.props.i18n.addResourceBundle('en', 'translation', {months: en}, true, false);
	}

	render() {
		const t = this.props.t;
		return (
			<div>
				{t("months.january")} <br/>
				{t("months.february")} <br/>
				{t("months.march")} <br/>
			</div>
		);
	}
}

export default withNamespaces()(Months);