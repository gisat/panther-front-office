import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';
import classnames from 'classnames';

import './style.scss';
import FadeIn from "../../../../../components/common/atoms/FadeIn/FadeIn";

import fallbackThumbnail from '../../../assets/scopePreviews/fallback.png';
import {NavLink} from "react-router-dom";

const thumbnails = {
	'fua': require(`../../../assets/scopePreviews/fua.png`),
	'msa': require(`../../../assets/scopePreviews/coasts-msa.png`),
	'tcoa': require(`../../../assets/scopePreviews/coasts-tcoa16.png`),
	'border-large': require(`../../../assets/scopePreviews/border.png`),
	'border-narrow': require(`../../../assets/scopePreviews/border-narrow.png`),
	'green-infrastructure': require(`../../../assets/scopePreviews/green-infrastructure.png`),
	'islands': require(`../../../assets/scopePreviews/islands.png`),
	'spa': require(`../../../assets/scopePreviews/spa.png`),
	'mountains': require(`../../../assets/scopePreviews/mountains.png`)
};

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

	onScopeSelect(key, e) {
		if (e.target.className !== "esponFuore-scope-card-link" && key !== (this.props.activeScope && this.props.activeScope.key)) {
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
			let style = {};

			if (scope) {
				const regionType = scope.data.configuration && scope.data.configuration.regionType;
				if (regionType && thumbnails[regionType]) {
					style.backgroundImage = `url(${thumbnails[regionType]})`;
				} else {
					style.backgroundImage = `url(${fallbackThumbnail})`;
				}

				let classes = classnames("esponFuore-scope-card", {
					disabled: scope && scope.data && scope.data.configuration && scope.data.configuration.fuoreMockScope
				});

				return (
					<div id="scopes" className={classes} style={style} tabIndex={0} onClick={this.onScopeSelect.bind(this, scope.key)} key={scope.key}>
						<div className="esponFuore-scope-card-name">{scope.data && scope.data.nameDisplay}</div>
						{scope.data && scope.data.description ? (
							<>
								<div className="esponFuore-scope-card-description">
									<Truncate lines={6}>
										{scope.data && scope.data.description}
									</Truncate>
								</div>
								{regionType ? (<NavLink className="esponFuore-scope-card-link" to={`/delineation-methods#${regionType}`}>Read more...</NavLink>) : null}
							</>
						) : null}
					</div>
				);
			} else {
				return null;
			}
		});
	}

}

export default ScopesList;

