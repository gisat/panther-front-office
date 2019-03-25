import React from 'react';
import { connect } from 'react-redux';
import Action from "../../../state/Action";

const mapDispatchToProps = dispatch => {
	return {
		apply: (viewKey) => {
			dispatch(Action.views.apply(viewKey));
		}
	}
};

class ReactRouterViewController extends React.PureComponent {

	constructor(props) {
		super();

		this.applyView = this.applyView.bind(this);

		if (props.match && props.match.params && props.match.params.viewKey) {
			this.applyView(props.match.params.viewKey);
		}
	}

	componentDidUpdate(prevProps) {
		let prev = prevProps.match && prevProps.match.params && prevProps.match.params.viewKey;
		let next = this.props.match && this.props.match.params && this.props.match.params.viewKey;
		if (next && (prev !== next)) {
			this.applyView(next);
		}
	}

	applyView(viewKey) {
		//apply view
		console.log('##### Apllying view:', viewKey);
	}

	render() {
		return null;
	}

}

export default connect(null, mapDispatchToProps)(ReactRouterViewController);

