import React from 'react';
import PropTypes from "prop-types";
import _ from 'lodash';
import {withNamespaces} from "react-i18next";

class MetadataList extends React.PureComponent {
	static propTypes = {
		models: PropTypes.array,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		return (
			<div>
				{this.props.models ? this.props.models.map(model => <div>{model.data.nameDisplay}</div>) : null}
			</div>
		);
	}
}

export default withNamespaces()(MetadataList);