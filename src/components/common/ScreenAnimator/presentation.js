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
			previousScreenKey: null,
			screenCount: React.Children.count(props.children),
			animate: false,
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
			activeScreenKey: key,
			previousScreenKey: this.state.activeScreenKey,
			animate: true,
		});

		//TODO - hide previous screen after transition ends
		// setTimeout(() => {
		// 	this.setState({
		// 		activeScreenKey: key,
		// 		previousScreenKey: null,
		// 		screenCount: 1,
		// 		animate: false
		// 	})
		// }, 300)
	}

	render() {
		const {screenCount, activeScreenKey, previousScreenKey, animate} = this.state
		let activeScreenIndex = 0;
		let children = []
		
		React.Children.forEach(this.props.children, (child, index) => {
			if (child.props.screenKey === activeScreenKey){
				activeScreenIndex = index;
			}

			//TODO - hide previous screen after transition ends
			// if(child.props.screenKey === activeScreenKey || child.props.screenKey === previousScreenKey) {
			if(child.props.screenKey === activeScreenKey ) {
				const left = index > 0 ? 100/(index+1) : 0;
				children.push(
					<div style={{width: 100/screenCount + '%', left: left + '%'}}>
						{React.cloneElement(child, {...child.props, switchScreen: this.switchScreen})}
					</div>
				);
			}

		});

		return (
			<div className="ptr-screen-viewport">
				<div className={`ptr-screen-container ${animate ? 'animate' : ''}`} style={{
					width: 100 * screenCount + '%',
					left: screenCount > 1 ? -100 * activeScreenIndex + '%' : 0,
				}}>
					{children}
				</div>
			</div>
		);
	}

}

export default ScreenAnimator;
