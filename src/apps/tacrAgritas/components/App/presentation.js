import React from 'react';
import Header from "./Header";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import Biofyzika from "./Biofyzika";
import Historie from "./Historie";
import Produktivita from "./Produktivita";

class App extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		activePeriodKey: PropTypes.string,
		activePlaceView: PropTypes.object,
		activeScope: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onMount();
	}

	render() {
		const props = this.props;

		return (
			<>
				<Helmet
					title={this.props.activePlace && this.props.activePlace.data.nameDisplay}
				/>
				<Header/>
				<div className="tacrAgritas-content">
					{props.activeScope ? this.renderMonitoring(props.activeScope) : null}
				</div>
				{this.renderFooter()}
			</>
		);
	}

	renderMonitoring(scope) {
		switch (scope.key) {
			case 'biofyzika':
				return (
					<Biofyzika
						data={this.props.data}
						placeView={this.props.activePlaceView}
						activePeriodKey={this.props.activePeriodKey}
						scope={scope}
					/>
				);
			case 'produktivita':
				return (
					<Produktivita
						data={this.props.data}
						placeView={this.props.activePlaceView}
						activePeriodKey={this.props.activePeriodKey}
						scope={scope}
					/>
				);
			case 'historie':
				return (
					<Historie
						data={this.props.data}
						placeView={this.props.activePlaceView}
						activePeriodKey={this.props.activePeriodKey}
						scope={scope}
					/>
				);
			default:
				return null;
		}
	}

	renderFooter() {
		return (
			<div className="tacrAgritas-footer">
				<div>{`© Gisat ${new Date().getFullYear()}`}</div>
			</div>
		);
	}
}

export default App;