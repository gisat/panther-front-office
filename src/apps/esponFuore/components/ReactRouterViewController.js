import React from 'react';
import {connect} from '@gisatcz/ptr-state';
import Action from "../state/Action";

const v4regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const mapDispatchToProps = dispatch => {
	return {
		apply: (viewKey) => {
			dispatch(Action.views.apply(viewKey, Action));
			console.log('##### Apllying view:', viewKey);
		}
	}
};

class ReactRouterViewController extends React.PureComponent {

	constructor(props) {
		super();

		this.applyView = this.applyView.bind(this);

		if (props.match && props.match.params && props.match.params.viewKey) {
			this.applyView(props.match.params.viewKey, props);
		}
	}

	componentDidUpdate(prevProps) {
		let prev = prevProps.match && prevProps.match.params && prevProps.match.params.viewKey;
		let next = this.props.match && this.props.match.params && this.props.match.params.viewKey;
		if (next && (prev !== next)) {
			this.applyView(next);
		}
	}

	applyView(viewKey, props) {
		let match = viewKey.match(v4regex);
		if (match) {
			props = props || this.props;
			props.apply(viewKey);
		}
	}

	render() {
		return null;
	}

}

export default connect(null, mapDispatchToProps)(ReactRouterViewController);

