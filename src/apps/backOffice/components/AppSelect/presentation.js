import React from 'react';
import classNames from 'classnames';

import Icon from '../../../../components/common/atoms/Icon';

import './style.scss';

class AppSelect extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};

		this.onSelectClick = this.onSelectClick.bind(this);
	}

	onSelectClick(e) {
		this.setState({
			open: !this.state.open
		});
	}

	render() {
		return (
			<>
				<div className="ptr-bo-app-select-current ptr-bo-app-select-item" tabIndex="0" onClick={this.onSelectClick}>
					<span>All apps</span><Icon />
				</div>
				<div className={classNames("ptr-bo-app-select-list", {open: this.state.open})}><div><div>
					{this.props.apps && this.props.apps.length && this.props.apps.map(this.renderApp) || null}
				</div></div></div>
			</>
		);
	}

	renderApp(app) {
		return app.backOffice ? null : (
			<div className="ptr-bo-app-select-item"><span>{app.nameDisplay || app.key}</span></div>
		);
	}

}

export default AppSelect;

