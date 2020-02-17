import React from 'react';
import PropTypes from 'prop-types';
import {utils} from "panther-utils"
import _ from 'lodash';

import './ScreenAnimator.css';

class ScreenAnimator extends React.PureComponent {
	constructor(props){
		super(props);
		this.state = {
			activeScreen: props.activeScreenKey || null,
			screenCount: React.Children.count(props.children)
		};
		this.switchScreen = this.switchScreen.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if (this.state.activeScreen !== nextProps.activeScreenKey){
			this.setState({
				activeScreen: nextProps.activeScreenKey
			});
		}
	}

	switchScreen(key){
		this.setState({
			activeScreen: key
		})
	}

	render() {
		let activeScreenIndex = 0;
		let children = React.Children.map(this.props.children, (child, index) => {
			if (child.props.screenKey === this.state.activeScreen){
				activeScreenIndex = index;
			}
			return (<div style={{
				width: 100/this.state.screenCount + '%'
			}}>{React.cloneElement(
				child,
				{...child.props, switchScreen: this.switchScreen}
			)}</div>);
		});

		return (
			<div className="ptr-screen-viewport">
				<div className="ptr-screen-container" style={{
					width: 100 * this.state.screenCount + '%',
					left: -100 * activeScreenIndex + '%'
					}}>
					{children}
				</div>
			</div>
		);
	}

}

export default ScreenAnimator;
