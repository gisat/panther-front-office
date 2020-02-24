import React from 'react';
import classnames from 'classnames';
import {Icon} from '@gisatcz/ptr-atoms'

class Expandable extends React.PureComponent {
	static defaultProps = {
		height: 70
	};

	constructor(props) {
		super(props);
		this.ref = React.createRef();

		this.state = {
			collapsed: true,
			height: this.props.height
		};

		this.onControlClick = this.onControlClick.bind(this);
	}

	onControlClick() {
		let maxHeight = this.ref.current && (this.ref.current.scrollHeight + 30);

		this.setState({
			collapsed: !this.state.collapsed,
			height: !this.state.collapsed ? this.props.height : maxHeight
		});
	}

	render() {
		let classes = classnames("scudeoStories19-expandable", {
			collapsed: this.state.collapsed
		});

		return (
			<div className={classes} ref={this.ref} style={{height: this.state.height}}>
				{this.props.children}
				<div className="scudeoStories19-expandable-control" onClick={this.onControlClick}>
					<Icon icon="chevron-left"/>
				</div>
			</div>
		);
	}
}

export default Expandable;

