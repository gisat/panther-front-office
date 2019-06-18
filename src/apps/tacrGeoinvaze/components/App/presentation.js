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
			<>
				<Helmet><title>{props.activeCase ? props.activeCase.data.nameDisplay : null}</title></Helmet>
				<Header
					categories={props.categories}
				/>
				<AdjustableColumns
					fixed
					content={[
						{
							width: "30rem",
							minWidth: "20rem",
							maxWidth: "35rem",
							render: props => (
								<div>bzz</div>
							)
						},
						{
							render: props => (
								<ReactResizeDetector
									handleWidth
									handleHeight
									render={({ width, height }) => {return (
										<>
											<MapSet
												mapSetKey="tacrGeoinvaze"
												width={width}
												height={height}
											>
											</MapSet>
											<MapTools>
												<MapControls zoomOnly/>
											</MapTools>
										</>
									)
									}}
								/>
							)
						},
					]}
				/>
			</>
		);
	}
}


export default TacrGeoinvazeApp;