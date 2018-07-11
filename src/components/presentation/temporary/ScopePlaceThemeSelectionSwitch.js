import React from 'react';
import PropTypes from 'prop-types';

import Names from '../../../constants/Names'

class ScopePlaceThemeSelectionSwitch extends React.PureComponent {

	static propTypes = {
		active: PropTypes.bool,
		open: PropTypes.bool,
		openOverlay: PropTypes.func,
		closeOverlay: PropTypes.func
	};

	constructor(props){
		super(props);
		this.state = {
			name: Names.SCOPE_SWITCH_OVERLAY_CLOSE
		};
		this.onSwitchClick = this.onSwitchClick.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			name: nextProps.open ? Names.SCOPE_SWITCH_OVERLAY_CLOSE : Names.SCOPE_SWITCH_OVERLAY_OPEN
		})
	}

	onSwitchClick(){
		if (this.props.open){
			this.props.closeOverlay();
		} else {
			this.props.openOverlay();
		}
	}

	render() {
		return (
			this.props.active ? (<div onClick={this.onSwitchClick} className="scope-place-theme-selection-switch">
				{this.state.name}
			</div>) : null
		);
	}
}

export default ScopePlaceThemeSelectionSwitch;
