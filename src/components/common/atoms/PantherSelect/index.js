import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';
import PantherSelectContext from './context';
import Item from './PantherSelectItem';
import Icon from "../Icon";

class PantherSelect extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		currentDisabled: PropTypes.bool, //todo better name
		open: PropTypes.bool,
		onBlur: PropTypes.func,
		onSelectClick: PropTypes.func,
		onSelect: PropTypes.func,
		renderCurrent: PropTypes.func,
		renderList: PropTypes.func,
		currentClasses: PropTypes.string,
		currentStyle: PropTypes.object,
		listClasses: PropTypes.string,
	};

	static defaultProps = {
		disabled: false,
		currentDisabled: false,
		currentStyle: null
	};

	constructor(props) {
		super(props);

		this.onBlur = this.onBlur.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onSelect = this.onSelect.bind(this);
	}


	onClick(e) {
		if (!this.props.disabled && !this.props.currentDisabled) {
			if (this.props.onSelectClick) {
				this.props.onSelectClick(e);
			}
		}
	}

	onBlur(e) {
		if (this.props.onBlur) {
			// timout needed, otherwise onBlur prevents onClick
			setTimeout(() => {
				this.props.onBlur();
			}, 100);
		}
	}

	onKeyPress(e) {
		if(e.charCode === 32) {
			this.onClick(e);
		} else if (e.charCode === 13){
			this.onClick(e);
		}
	}

	onSelect(itemKey) {
		if (!this.props.disabled) {
			if (this.props.onSelect) {
				this.props.onSelect(itemKey);
			}
		}
	}

	render() {



		let classes = classNames(
			'ptr-panther-select', {
				open: !!this.props.open,
				disabled: !!this.props.disabled,
				currentDisabled: !!this.props.currentDisabled
			},
			this.props.className
		);

		return (
			<div className={classes} onBlur={this.onBlur}>
				<div
					className={classNames("ptr-panther-select-current", this.props.currentClasses, {disabled: !!this.props.disabled})}
					tabIndex={this.props.disabled || this.props.currentDisabled ? "-1" : "0"}
					onClick={this.onClick}
					style={this.props.currentStyle}
				>
					<div>{this.props.renderCurrent(this.props)}</div>
					<div className="ptr-panther-select-current-icon"><Icon icon="triangle-down"/></div>
				</div>
				<div className={classNames("ptr-panther-select-list", this.props.listClasses)}>
					<div>
						<div>
							<PantherSelectContext.Provider value={{onSelect: this.onSelect}}>
								{this.props.children}
							</PantherSelectContext.Provider>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// renderList(children) {
	//
	// 	return React.Children.map(children, child => {
	// 		// return child;
	// 		if (typeof child === 'object') {
	// 			if (child.type === Item) {
	// 				let {children, itemKey, ...props} = child.props;
	// 				if (!itemKey) throw new Error('PantherSelectItem must have itemKey set');
	// 				return React.cloneElement(child, {...props, onSelect: this.onSelect.bind(this, itemKey)}, children);
	// 			} else {
	// 				let {children, ...props} = child.props;
	// 				return React.cloneElement(child, props, this.renderList(children));
	// 			}
	// 		} else {
	// 			return child;
	// 		}
	// 	});
	//
	// }


}

export const PantherSelectItem = Item;
export default PantherSelect;
