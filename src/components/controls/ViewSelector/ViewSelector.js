import React from 'react';
import PropTypes from 'prop-types';

class ViewSelector extends React.PureComponent {

	static propTypes = {
		activeScope: PropTypes.object
	};

	constructor(props) {
		super();
	}

	render() {
		if (this.props.activeScope && this.props.activeScope.viewSelection){
			return (
				<div className="ptr-view-selector">
					View selector
				</div>
			);
		} else {
			return (
				<div>
					Loading...
				</div>
			)
		}
	}

}

export default ViewSelector;
