import React from 'react';
import { withNamespaces } from 'react-i18next';

import {utils} from '@gisatcz/ptr-utils'
import cz from './locales/cz.json';
import en from './locales/en.json';
import i18next from "i18next";

// add locales to component namespace
utils.addI18nResources(i18next,'Demo#Months', {cz, en});

class Months extends React.PureComponent {
	render() {
		const t = this.props.t;
		return (
			<div>
				From common namespace (overriden by project): {t("common:months.january")} <br/>
				From component namespace: {t("months.january")} <br/>
				From common namespace (overriden by project): {t("common:months.february")} <br/>
				From component namespace: {t("months.february")} <br/>

				From common namespace: {t("common:months.march")} <br/>
				From common namespace (overriden by project): {t("common:months.april")} <br/>
			</div>
		);
	}
}

export default withNamespaces(['Demo#Months', 'common'])(Months);