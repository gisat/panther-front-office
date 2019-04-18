import React from "react";
import PropTypes from "prop-types";
import Window from "./components/Window";

class WindowsContainer extends React.PureComponent {

	static propTypes = {
		onWindowClick: PropTypes.func,
		onWindowClose: PropTypes.func,
		onWindowResize: PropTypes.func,
		set: PropTypes.shape({
			orderByHistory: PropTypes.array
		}),
		windows: PropTypes.object
	};

	constructor (props) {
		super(props);
		this.onWindowClick = this.props.onWindowClick.bind(this);
		this.onWindowCloseClick = this.onWindowCloseClick.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);
	}

	onWindowClick(windowKey) {
		this.props.onWindowClick(windowKey);
	}

	onWindowCloseClick(windowKey) {
		this.props.onWindowClose(windowKey);
	}

	onWindowResize(windowKey, width, height) {
		this.props.onWindowResize(windowKey, width, height);
	}

	// TODO what if any child is Window component?
	render() {
		return (
			<div className="ptr-windows-container">
				{this.props.children}
				{this.renderWindows()}
			</div>
		);
	}

	renderWindows() {
		if (this.props.set) {
			const order = this.props.set.orderByHistory;

			return order.map((windowKey, index) => {
				let window = this.props.windows[windowKey];

				if (window.data.component) {
					return this.renderWindow(window.key, index, window.data.settings, React.createElement(window.data.component, {...window.data.props}));
				} else {
					return this.renderWindow(window.key, index, window.data.settings, null);
				}
			});
		} else {
			return null;
		}
	}

	renderWindow(key, index, settings, content) {
		return (
			<Window
				key={key}
				content={content}
				onClick={this.onWindowClick}
				onCloseClick={this.onWindowCloseClick}
				onResize={this.onWindowResize}
				windowKey={key}
				withoutTilte={!settings.title}
				zIndex={index}
				{...settings}
			/>
		);
	}
}

export default WindowsContainer;