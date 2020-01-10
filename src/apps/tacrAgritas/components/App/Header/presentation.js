import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import './style.scss';

const BUFFER = 30;

class Header extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		period: PropTypes.object,
		place: PropTypes.object,
		scope: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();

		this.state = {
			fixedHeaderOpen: false
		};

		window.addEventListener("scroll", this.onWindowScroll.bind(this));
	}

	onWindowScroll(e) {
		const position = e.currentTarget.scrollY;
		const introHeight = this.ref && this.ref.current.offsetHeight;
		const shouldOpenFixedHeader = position > (introHeight - BUFFER);

		if (shouldOpenFixedHeader !== this.state.fixedHeaderOpen) {
			this.setState({
				fixedHeaderOpen: shouldOpenFixedHeader
			});
		}
	}

	render() {
		const props = this.props;

		let classes = classnames("tacrAgritas-fixed-header", {
			open: this.state.fixedHeaderOpen
		});

		return (
			<>
				<div className="tacrAgritas-header" ref={this.ref}>
					{props.place ? this.renderTitle() : null}
					{props.case && props.scope && props.period ? this.renderSelections() : null}
				</div>
				<div className={classes}>

				</div>
			</>
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