import React from "react";
import Helmet from "react-helmet";

import LandingPage from '../LandingPage';
import Header from '../Header';
import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/MapSet";
import LayersTree from "../../../../components/common/maps/LayersTree";
import Window from "../../../../components/common/WindowsContainer/components/Window";

export default props => {
	// if (false) {
	if (!props.activeScopeKey) {

		return React.createElement(LandingPage);

	} else {

		const layersFilter = {
			applicationKey: 'esponFuore'
		};

		return (
			<div className="esponFuore-app">
				<Helmet><title>{props.activeScope ? props.activeScope.data.nameDisplay : null}</title></Helmet>
				<Header />
				<div className="esponFuore-content">
					<WindowsContainer setKey="esponFuore">
						<AdjustableColumns
							fixed
							content={[
								{
									component: MapSet,
									props: {
										mapSetKey: "esponFuore",
										layerTreesFilter: {
											applicationKey: 'esponFuore'
										}
									}
								},
								{
									width: "25rem",
									render: props => (
									<div>
										<LayersTree 
											componentKey="LayersTree_demo"
											layerTreesFilter={layersFilter}
											/>
									</div>)
								},
							]}
						/>
						{/*<Window*/}
							{/*title="Very looooooooong test title of the window"*/}
						{/*>*/}
							{/*<div>Blablabla</div>*/}
						{/*</Window>*/}
						{/*<Window*/}
							{/*withoutHeader*/}
						{/*>*/}
							{/*<div>Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg</div>*/}
							{/*<div>Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg</div>*/}
							{/*<div>Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg</div>*/}
							{/*<div>Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg</div>*/}
							{/*<div>Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg</div>*/}
							{/*<div>Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg Blablabla fsdsdgsdg dfggsdgsdgsdg</div>*/}

						{/*</Window>*/}
					</WindowsContainer>
				</div>
			</div>
		);

	}
}