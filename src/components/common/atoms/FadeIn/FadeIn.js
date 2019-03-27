import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

class FadeIn extends React.PureComponent  {
	static propTypes = {
		duration: PropTypes.number
	};

	static defaultProps = {
		duration: 400,
		delay: 50
	};

	constructor(props) {
		super(props);

		this.state = {
			maxVisible: 0
		}
	}

	componentDidMount() {
		const count = React.Children.count(this.props.children);
		let i = 0;
		this.interval = setInterval(() => {
			i++;
			if (i > count) clearInterval(this.interval);
			this.setState({ maxVisible: i });
		}, this.props.delay);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div className="ptr-fade-in-container">
				{React.Children.map(this.props.children, (child, i) => {
					let childStyle = child.props.style ? child.props.style : {};
					let style = {...childStyle,
						transition: `opacity ${this.props.duration}ms`,
						opacity: this.state.maxVisible > i ? 1 : 0
					};
					return (React.cloneElement(child, {style}));
				})}
			</div>
		);
	}
}

export default FadeIn;