import React from 'react';
import classNames from 'classnames';

class Menu extends React.PureComponent {
	render() {
		return (
			<div
				className={classNames('ptr-menu', this.props.className, {
					open: this.props.open,
					bottom: this.props.bottom,
					top: this.props.top,
					left: this.props.left,
					right: this.props.right
				})}
				style={{
					height: this.props.open ? (React.Children.toArray(this.props.children).filter((child) => React.isValidElement(child)).length * 2) + 'rem' : 0
				}}
				onClick={(e)=>{e.preventDefault()}}
			>
				{this.props.children}
			</div>
		);
	}
}

export default Menu;

export const MenuItem = props => {

	let content = React.Children.map(props.children, child => {

		if (typeof child === 'string') {
			return (
				<div className="ptr-menu-item-caption">{child}</div>
			);
		} else {
			return child;
		}
	});

	return (
		<div
			className={classNames('ptr-menu-item', props.className, {
				selected: props.selected,
				disabled: props.disabled
			})}
			onClick={(e)=>{
				if (props.onClick) props.onClick(e);
				e.preventDefault();
			}}
		>
			{content}
		</div>
	);
};
