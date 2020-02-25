import React from 'react';
import {withNamespaces} from '@gisatcz/ptr-locales';
import Helmet from "react-helmet";

import Screens from "../../../components/common/Screens";
import TopBar from "./TopBar";

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
					<Screens key={screenSetKey} setKey={screenSetKey} baseActiveWidth={baseActiveWidth}>
						{children}
					</Screens>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(Page);