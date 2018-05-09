import React from 'react';
import classNames from 'classnames';

export default props => (
	<div
		className={classNames('ptr-menu', {
			open: props.open
		})}
		style={{
			height: props.open ? (React.children.count(props.children) * 2) + 'rem' : 0
		}}
	>
		{props.children}
	</div>
);

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
