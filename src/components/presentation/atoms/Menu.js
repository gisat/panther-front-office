import React from 'react';
import classNames from 'classnames';

class Menu extends React.PureComponent {
	render() {
		return (
			<div
				className={classNames('ptr-menu', {
					open: this.props.open
				})}
				style={{
					height: this.props.open ? (React.children.count(this.props.children) * 2) + 'rem' : 0
				}}
			>
				{this.props.children}
			</div>
		);
	}
}

export default Menu;

export const MenuItem = props => (
	<div
		className={classNames('ptr-menu-item', props.className, {
			selected: props.selected
		})}
		onClick={props.onClick}
	>
		{props.children}
	</div>
);
