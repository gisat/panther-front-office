import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';
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
							{this.props.renderList(this.props)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default PantherSelect;
