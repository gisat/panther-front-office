import React from 'react';
import {withNamespaces} from '@gisatcz/ptr-locales';
import {connects} from '@gisatcz/ptr-state';
import {Screens} from '@gisatcz/ptr-components';
import Helmet from "react-helmet";

import TopBar from "./TopBar";

const ConnectedScreens = connects.Screens(Screens);

class Page extends React.PureComponent {
	render() {
		let {children, screenSetKey, baseActiveWidth, ...props} = this.props;
		return (
			<div className="ptr-bo-page ptr-bo-colours">
				<Helmet
					titleTemplate="%s | Panther Back Office"
					defaultTitle="Panther Back Office"
				/>
				<div className="ptr-bo-top-bar">
					<TopBar {...props} />
				</div>
				<div className="ptr-bo-content">
					<ConnectedScreens key={screenSetKey} setKey={screenSetKey} baseActiveWidth={baseActiveWidth}>
						{children}
					</ConnectedScreens>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(Page);