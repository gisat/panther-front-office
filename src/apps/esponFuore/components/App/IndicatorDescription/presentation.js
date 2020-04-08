import React from "react";
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';
import './style.scss';

class IndicatorDescription extends React.PureComponent {

	static propTypes = {
		activeIndicator: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			expanded: false
		};

		this.toggleLines = this.toggleLines.bind(this);
	}

	toggleLines() {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	render() {
		return this.props.activeIndicator ? (
			<div className="esponFuore-indicator-description">
				<p>
					<Truncate
						lines={!this.state.expanded && 3}
						ellipsis={(
							<span>... <em className="esponFuore-collapse-text-toggle" title="Expand" onClick={this.toggleLines}>Read&nbsp;more</em></span>
						)}
					>
						{this.props.activeIndicator.data.description}
					</Truncate>
					{this.state.expanded && (
						<em className="esponFuore-collapse-text-toggle show-less" onClick={this.toggleLines}>Collapse text</em>
					)}
				</p>
			</div>
		) : null
	}
}

export default IndicatorDescription;
