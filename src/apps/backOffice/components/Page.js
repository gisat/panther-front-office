import React from 'react';
import {withNamespaces} from "react-i18next";

class Page extends React.PureComponent {
	render() {
		return (
			<div className="ptr-bo-page">
				<div className="ptr-bo-menu">
					{this.props.match.url}
				</div>
				<div className="ptr-bo-content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default withNamespaces()(Page);