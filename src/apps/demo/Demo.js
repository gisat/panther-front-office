import React from 'react';
import {withNamespaces} from "react-i18next";
import utils from '../../utils/utils';

import Days from "../../components/specific/Demo/Days";
import Months from "../../components/specific/Demo/Months";

import cz from "./locales/cz/common";
import en from "./locales/en/common";
import WorldWindMap from "../../components/common/maps/WorldWindMap";

// override and extend locales in namespaces
utils.addI18nResources('common', {cz, en});

class Demo extends React.PureComponent {
	render() {
		return (
			<div id="demo">
				<WorldWindMap/>
			</div>
		);
	}
}

export default withNamespaces()(Demo);