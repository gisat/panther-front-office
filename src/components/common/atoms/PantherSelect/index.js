import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';
import Item from './PantherSelectItem';
import Icon from "../Icon";

class PantherSelect extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		open: PropTypes.bool,
		onSelectClick: PropTypes.func,
		renderCurrent: PropTypes.func,
		renderList: PropTypes.func,
		currentClasses: PropTypes.string,
		listClasses: PropTypes.string,
	};

	static defaultProps = {
		disabled: false
	};

	constructor(props) {
		super(props);

		this.onBlur = this.onBlur.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}


	onClick(e) {
		if (!this.props.disabled) {
			if (this.props.onSelectClick) {
				this.props.onSelectClick(e);
			}
		}
	}

	onBlur() {

	}

	onKeyPress(e) {
		if(e.charCode === 32) {
			this.onClick(e);
		} else if (e.charCode === 13){
			this.onClick(e);
		}
	}

	onSelect(itemKey) {
		console.log('##### selected item', itemKey);
	}


	render() {



		let classes = classNames(
			'ptr-panther-select', {
				open: !!this.props.open,
			},
			this.props.className
		);

		return (
			<div className={classes}>
				<div
					className={classNames("ptr-panther-select-current", this.props.currentClasses, {disabled: !!this.props.disabled})}
					tabIndex={this.props.disabled ? "-1" : "0"}
					onClick={this.onClick}
				>
					<div>{this.props.renderCurrent(this.props)}</div>
					<div className="ptr-panther-select-current-icon"><Icon icon="triangle-down"/></div>
				</div>
				<div className={classNames("ptr-panther-select-list", this.props.listClasses)}>
					<div>
						<div>
							{this.renderList(this.props.children)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderList(children) {

		return React.Children.map(children, child => {
			console.log('####', child);
			// return child;
			if (typeof child === 'object') {
				if (child.type === Item) {
					let {children, itemKey, ...props} = child.props;
					if (!itemKey) throw new Error('PantherSelectItem must have itemKey set');
					return React.cloneElement(child, {...props, onSelect: this.onSelect.bind(this, itemKey)}, children);
				} else {
					let {children, ...props} = child.props;
					return React.cloneElement(child, props, this.renderList(children));
				}
			} else {
				return child;
			}
		});

	}


}

export const PantherSelectItem = Item;
export default PantherSelect;
