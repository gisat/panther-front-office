import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Helmet from "react-helmet";

import Store, {history} from './store';
import Action from "../../state/Action";
import i18n from '../../i18n';

// base styles need to be imported before all components
import '../../styles/reset.css';
import '../../styles/base.scss';
import './styles/index.scss';


import Docs, {Directory, Page, Anchor} from "./components/Docs";

import Index from "./components/pages/index";
import Design from "./components/pages/design";
import Typography from "./components/pages/design/Typography";
import Buttons from "./components/pages/components/atoms/Buttons";
import CartesianCharts from "./components/pages/components/visualizations/cartesianCharts/CartesianCharts";
import ColumnChartDoc from "./components/pages/components/visualizations/cartesianCharts/ColumnChartDoc";
import LineChartDoc from "./components/pages/components/visualizations/cartesianCharts/LineChartDoc";
import ScatterChartDoc from "./components/pages/components/visualizations/cartesianCharts/ScatterChartDoc";
import AsterChartDoc from "./components/pages/components/visualizations/AsterChartDoc";
import FormsDoc from "./components/pages/components/atoms/FormsDoc";
import ItemSelectDoc from "./components/pages/components/atoms/ItemSelectDoc";
import MapDoc from "./components/pages/components/maps/MapDoc";
import LeafletDoc from "./components/pages/components/maps/LeafletDoc";


export default (path, baseUrl) => {

	Store.dispatch(Action.app.setKey('docs'));
	Store.dispatch(Action.app.setBaseUrl(baseUrl));


	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(
		<Provider store={Store}>
			<Helmet
				titleTemplate="%s | Panther docs"
				defaultTitle="Panther docs"
			/>
			<ConnectedRouter history={history}>
				<Docs path={path} component={Index}>
					<Directory label="Architecture" path="architecture">
						<Page label="Applications" path="applications"/>
						<Page label="Common data types" path="commonDataTypes"/>
						<Page label="Specific data types" path="specificDataTypes"/>
					</Directory>
					<Directory label="Design" path="design" component={Design}>
						<Page label="Typography" path="typography" component={Typography} />
						<Page label="Colours" path="colours"/>
					</Directory>
					<Directory label="Components" path="components">
						<Directory label="Maps" path="maps">
							<Directory label="Map" path="map" component={MapDoc}>
								<Page label="WebWorldWind" path="webWorldWind"/>
								<Page label="Leaflet" path="leaflet" component={LeafletDoc}/>
							</Directory>
							<Page label="Map controls" path="mapControls"/>
							<Page label="Map set" path="mapSet"/>
							<Page label="GoToPlace" path="goToPlace"/>
						</Directory>
						<Directory label="Visualizations" path="visualizations">
							<Directory label="Cartesian charts" path="cartesianCharts" component={CartesianCharts}>
								<Page label="Line chart" path="lineChart" component={LineChartDoc}>
									<Anchor label="Props" path="props"/>
									<Anchor label="Data structure" path="dataStructure"/>
									<Anchor label="Basic settings" path="basicSettings"/>
									<Anchor label="Lines without points" path="withoutPoints"/>
									<Anchor label="Graying and aggregation" path="graying"/>
								</Page>
								<Page label="Column chart" path="columnChart" component={ColumnChartDoc}>
									<Anchor label="Props" path="props"/>
									<Anchor label="Data structure" path="dataStructure"/>
									<Anchor label="Basic settings" path="basicSettings"/>
									<Anchor label="Serial data handling" path="serialData"/>
									<Anchor label="Custom bar colors" path="barColors"/>
									<Anchor label="Aggregation" path="aggregation"/>
								</Page>
								<Page label="Scatter chart" path="scatterChart" component={ScatterChartDoc}>
									<Anchor label="Props" path="props"/>
									<Anchor label="Data structure" path="dataStructure"/>
									<Anchor label="Basic settings" path="basicSettings"/>
									<Anchor label="Point radius" path="pointRadius"/>
									<Anchor label="Serial data handling" path="serialData"/>
								</Page>
							</Directory>
							<Page label="Aster chart" path="asterChart" component={AsterChartDoc}>
								<Anchor label="Props" path="props"/>
								<Anchor label="Data structure" path="dataStructure"/>
								<Anchor label="Basic settings" path="basicSettings"/>
								<Anchor label="Relative values" path="relativeValues"/>
								<Anchor label="Dimensions" path="dimensions"/>
								<Anchor label="Forced min & max" path="forceMinMax"/>
								<Anchor label="Grid" path="grid"/>
								<Anchor label="Radials & legend" path="radials"/>
								<Anchor label="Custom hover value" path="customHover"/>
							</Page>
						</Directory>
						<Directory label="Atoms" path="atoms">
							<Page label="Buttons" path="buttons" component={Buttons}/>
							<Page label="Forms" path="forms" component={FormsDoc}/>
							<Page label="ItemSelect" path="itemSelect" component={ItemSelectDoc}/>
							<Page label="Icon" path="icon"/>
							<Page label="Loader" path="loader"/>
							<Page label="EditableText" path="editableText"/>
							<Page label="Utilities ???" path="utilities"/>{/* center, fadeIn, expandRowButton, etc. */}
						</Directory>
						<Directory label="Interface elements" path="interfaceElements">
							<Page label="Panther select" path="pantherSelect">
								<Anchor label="Usage" path="usage"/>
								<Anchor label="Extending" path="extending"/>
							</Page>
							<Page label="Adjustable columns" path="adjustableColumns" />
							<Page label="ScreenAnimator" path="screenAnimator" />
						</Directory>
						<Directory label="Controls" path="controls">
							<Page label="Timeline" path="timeline" />
							<Page label="Areas" path="areas" />
							<Page label="Layers" path="layers" />
							<Page label="User & login overlay" path="user"/>
							<Page label="Share ???" path="share"/>
						</Directory>
						<Directory label="Logical ??? / common features ??? / ???" path="iHaveNoIdea">
							<Page label="AppContainer" path="appContainer"/>
							<Page label="HoverHandler" path="hoverHandler"/>
							<Page label="WindowsContainer" path="windowsContainer"/>
						</Directory>
					</Directory>
					<Directory label="Code" path="code">
						<Page label="Using data in applications ??" path="usingData" />
						<Page label="API" path="api" />
					</Directory>
					<Page label="Panther 2" path="panther2" />
				</Docs>
			</ConnectedRouter>
		</Provider>,document.getElementById('ptr')
	);
}