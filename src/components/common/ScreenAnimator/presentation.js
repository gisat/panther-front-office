import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../utils/utils';
import _ from 'lodash';

import './style.scss';

class ScreenAnimator extends React.PureComponent {
	constructor(props){
		super(props);
		this.state = {
			activeScreenKey: props.activeScreenKey || null,
			screenCount: React.Children.count(props.children)
		};
		this.switchScreen = this.switchScreen.bind(this);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.activeScreenKey !== prevProps.activeScreenKey) {
			this.switchScreen(this.props.activeScreenKey);
		}
	}

	switchScreen(key){
		this.setState({
			activeScreenKey: key
		})
	}

	render() {
		let activeScreenIndex = 0;
		let children = React.Children.map(this.props.children, (child, index) => {
			if (child.props.screenKey === this.state.activeScreenKey){
				activeScreenIndex = index;
			}
			return (
				<div style={{width: 100/this.state.screenCount + '%'}}>
					{React.cloneElement(child, {...child.props, switchScreen: this.switchScreen})}
				</div>
			);
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
