import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';

import './style.scss';

class ScopesList extends React.PureComponent {

	static propTypes = {
		onMount: PropTypes.func,
		onScopeSelect: PropTypes.func,
		onUnmount: PropTypes.func,
		scopes: PropTypes.array
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
		return (this.props.scopes ?
			<div className="ptr-fuore-scopes-list">
				{this.renderCards()}
			</div> : null
		);
	}

	// TODO implement Read more.. for scope description?
	renderCards() {
		return this.props.scopes.map(scope => {
			return (
				<div className="ptr-fuore-scope-card" tabIndex={0} onClick={this.props.onScopeSelect.bind(this, scope.key)}>
					<div className="ptr-fuore-scope-card-name">{scope.data && scope.data.nameDisplay}</div>
					{scope.data && scope.data.description ? (
						<div className="ptr-fuore-scope-card-description">
							<Truncate lines={6}>
								{scope.data && scope.data.description}
							</Truncate>
						</div>
					) : null}
				</div>
			);
		});
	}

}

export default ScopesList;

