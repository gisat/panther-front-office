import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';
import classnames from 'classnames';

import './style.scss';
import FadeIn from "../../../../../components/common/atoms/FadeIn/FadeIn";
import scopeThumbnail0 from '../../../assets/img/thumbnail_0.jpg';
import scopePreview1 from '../../../assets/img/preview_1.jpg';

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

	onScopeSelect(key) {
		if (key !== (this.props.activeScope && this.props.activeScope.key)) {
			this.props.onScopeSelect(key);
		}
	}

	render() {
		const delay = 200;
		const duration = 600;

		let style = this.props.scopes ? {
			maxHeight: this.props.scopes.length * 15 + 'rem',
			transition: `max-height ${this.props.scopes.length * delay}ms ease-in-out`
		} : {};

		return (
			<div className="esponFuore-scopes-list" style={style}>
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
				backgroundImage: index === 0 ? `url(${scopeThumbnail0})` : `url(${scopePreview1})`
			};

			let classes = classnames("esponFuore-scope-card", {
				disabled: scope && scope.data && scope.data.configuration && scope.data.configuration.fuoreMockScope
			});

			return (
				<div className={classes} style={style} tabIndex={0} onClick={this.onScopeSelect.bind(this, scope.key)} key={scope.key}>
					<div className="esponFuore-scope-card-name">{scope.data && scope.data.nameDisplay}</div>
					{scope.data && scope.data.description ? (
						<div className="esponFuore-scope-card-description">
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

