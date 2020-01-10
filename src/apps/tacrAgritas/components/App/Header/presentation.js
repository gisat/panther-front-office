import PropTypes from 'prop-types';
import React from 'react';

class Header extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		period: PropTypes.object,
		place: PropTypes.object,
		scope: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return (
			<div className="tacrAgritas-header">
				{props.place ? this.renderTitle() : null}
				{props.case && props.scope && props.period ? this.renderSelections() : null}
			</div>
		);
	}

	renderTitle() {
		return (
			<div className="tacrAgritas-title">
				{this.props.place.data.nameDisplay}
			</div>
		);
	}

	renderSelections() {
		const props = this.props;

		return (
			<div className="tacrAgritas-selections">
				<div>{props.scope.data.namDisplay}</div>
				<div>{props.period.data.nameDisplay}</div>
				<div>{props.case.data.nameDisplay}</div>
			</div>
		);
	}
}

export default Header;