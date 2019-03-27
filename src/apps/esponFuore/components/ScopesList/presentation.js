import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';

import './style.scss';
import FadeIn from "../../../../components/common/atoms/FadeIn/FadeIn";

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
		const delay = 200;
		const duration = 600;

		let style = this.props.scopes ? {
			maxHeight: this.props.scopes.length * 15 + 'rem',
			transition: `max-height ${this.props.scopes.length * delay}ms ease-in-out`
		} : {};

		return (
			<div className="ptr-fuore-scopes-list" style={style}>
				{this.props.scopes ?
					<FadeIn
						delay={delay}
						duration={duration}
					>
						{this.renderCards()}
					</FadeIn>
					: null}
			</div>
		);
	}

	// TODO implement Read more.. for scope description?
	renderCards() {
		return this.props.scopes.map((scope, index) => {
			let style = {
				backgroundImage: `url('/fuoreImg/preview_${(index + 2) % 2}.png')`
			};

			return (
				<div className="ptr-fuore-scope-card" style={style} tabIndex={0} onClick={this.props.onScopeSelect.bind(this, scope.key)} key={scope.key}>
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

