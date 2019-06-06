import React from "react";
import Helmet from "react-helmet";

import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/MapSet";
import MapControls from "../../../../components/common/maps/MapControls";
import MapControlLegend from "../../../../components/common/maps/MapControlLegend";
import MapTools from "../../../../components/common/maps/MapTools";


import ReactResizeDetector from 'react-resize-detector';
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import Header from '../Header';

class TacrGeoinvazeApp extends React.PureComponent {

	render() {
		const props = this.props;

		return (
			<div className="tacrGeoinvaze-app">
				<Helmet><title>{props.activeCase ? props.activeCase.data.nameDisplay : null}</title></Helmet>
				<Header />
			</div>
		);
	}
}


export default TacrGeoinvazeApp;