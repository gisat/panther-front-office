import React from 'react';
import {withNamespaces} from "react-i18next";
import utils from '../../utils/utils';
import propTypes from 'prop-types';

import Screens from '../../components/common/Screens';

import Days from "../../components/specific/Demo/Days";
import Months from "../../components/specific/Demo/Months";

import cz from "./locales/cz/common";
import en from "./locales/en/common";
import MapSet from "../../components/common/maps/MapSet";
import MapControls from "../../components/common/maps/MapControls";
import LayersTree from "../../components/common/maps/LayersTree";

// override and extend locales in namespaces
utils.addI18nResources('common', {cz, en});

class Demo extends React.PureComponent {
	render() {
		return (
			<Screens
				setKey="demo"
			>
				<div id="demo" style={{display: 'flex', height: '100%'}}>
					<LayersTree componentKey="LaersTree_demo" layersTreeKey={this.props.treeKey}/>
					<MapControls />
					<MapSet
						mapSetKey="MapSet1"
					/>
				</div>
			</Screens>
		);
	}
}

Demo.propTypes = {
	treeKey: propTypes.string,
}

export default withNamespaces()(Demo);