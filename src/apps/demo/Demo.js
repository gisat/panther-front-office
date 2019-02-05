import React from 'react';
import {withNamespaces} from "react-i18next";
import utils from '../../utils/utils';

import Screens from '../../components/common/Screens';

import Days from "../../components/specific/Demo/Days";
import Months from "../../components/specific/Demo/Months";

import cz from "./locales/cz/common";
import en from "./locales/en/common";
import MapSet from "../../components/common/maps/MapSet";
import MapControls from "../../components/common/maps/MapControls";

// override and extend locales in namespaces
utils.addI18nResources('common', {cz, en});

class Demo extends React.PureComponent {
	render() {
		return (
			<Screens
				set="demo"
			>
				<div id="demo">
					<MapControls />
					<MapSet
						mapSetKey="MapSet1"
					/>
				</div>
			</Screens>
		);
	}
}

export default withNamespaces()(Demo);