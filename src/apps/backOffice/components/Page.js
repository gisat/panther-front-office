import React from 'react';
import {withNamespaces} from "react-i18next";
import Screens from "../../../components/common/Screens";

import './page.css';
class Page extends React.PureComponent {
	render() {
		return (
			<div className="ptr-bo-page">
				<div className="ptr-bo-menu">
					{this.props.match.url}
				</div>
				<div className="ptr-bo-content">
					<Screens setKey={this.props.screenSetKey} children={this.props.children}>
						{this.props.children}
					</Screens>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(Page);