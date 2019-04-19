import React from "react";
import Helmet from "react-helmet";

import AppContext from '../../context';

import LandingPage from '../LandingPage';
import Header from '../Header';
import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/MapSet";
import LayersTree from "../../../../components/common/maps/LayersTree";
import Window from "../../../../components/common/WindowsContainer/components/Window";
import MapControls from "../../../../components/common/maps/MapControls";

class EsponFuoreApp extends React.PureComponent {
	static contextType = AppContext;

	render() {
		const props = this.props;

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
						<WindowsContainer setKey={this.context.windowSetKey}>
							<AdjustableColumns
								fixed
								content={[
									{
										render: props => (
											<>
												<MapSet
													mapSetKey={this.context.mapSetKey}
													layerTreesFilter={{applicationKey: 'esponFuore'}}
												/>
												<MapControls/>
											</>
										)
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
}


export default EsponFuoreApp;