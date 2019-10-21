import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.css';

class FadeIn extends React.PureComponent  {
	static propTypes = {
		delay: PropTypes.number,
		duration: PropTypes.number,
		vertical: PropTypes.bool
	};

	static defaultProps = {
		duration: 1000,
		delay: 100
	};

	constructor(props) {
		super(props);

		this.state = {
			opacity: 0
		}
	}

	componentDidMount() {
		let self = this;
		setTimeout(() => {
			self.setState({
				opacity: 1
			});
		},1);
	}

	render() {
		let classes = classnames('ptr-fade-in-container', {
			vertical: this.props.vertical
		});

		return (
			<div className={classes}>
				{React.Children.map(this.props.children, (child, i) => {
					if (child) {
						let childStyle = child.props.style ? child.props.style : {};
						let style = {...childStyle,
							transition: `opacity ${this.props.duration}ms ease-in-out ${i*this.props.delay}ms`,
							opacity: this.state.opacity
						};
						return (React.cloneElement(child, {style}));
					} else {
						return null;
					}
				})}
			</div>
		);
	}
}

export default FadeIn;