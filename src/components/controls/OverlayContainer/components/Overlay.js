import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

class Overlay extends React.PureComponent {

	static propTypes = {
		scope: PropTypes.object,
		activeAoi: PropTypes.string,
		content: PropTypes.shape({
			title: PropTypes.string,
			text: PropTypes.string
		}),
		contentOffset: PropTypes.object
	};

	constructor(props) {
		super();
	}

	render() {
		let classes = classNames(
			'ptr-overlay', {
				'open': !this.props.activeAoi
			}
		);
		let content = this.renderContent();
		return (
			<div className={classes}>
				{content}
			</div>
		);
	}

	renderContent(){
		let style = {
			top: 'auto',
			bottom: 'auto',
			left: 'auto',
			right: 'auto'
		};

		let offset = this.props.contentOffset;
		if (offset){
			_.forIn(offset, function(value, key){
				style[key] = value + 'px';
			});
		}

		return (
			<div className='ptr-overlay-content' style={style}>
				<h3>{this.props.content.title}</h3>
				<p>{this.props.content.text}</p>
			</div>
		);
	}
}

export default Overlay;
