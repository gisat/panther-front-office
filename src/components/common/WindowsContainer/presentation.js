import React from "react";
import PropTypes from "prop-types";
import Window from "./components/Window";

class WindowsContainer extends React.PureComponent {

	static propTypes = {
		onWindowClose: PropTypes.func,
		set: PropTypes.shape({
			orderByHistory: PropTypes.array
		}),
		windows: PropTypes.object
	};

	constructor (props) {
		super(props);
		this.onWindowCloseClick = this.onWindowCloseClick.bind(this);
	}

	onWindowCloseClick(windowKey) {
		this.props.onWindowClose(windowKey)
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

				// TODO solve props passing
				if (window.data.component) {
					return this.renderWindow(window.key, index, window.data.title, React.createElement(window.data.component, {...window.data.props}));
				} else {
					return this.renderWindow(window.key, index, window.data.title, null);
				}
			});
		} else {
			return null;
		}
	}

	renderWindow(key, index, title, content) {
		return (
			<Window
				content={content}
				onCloseClick={this.onWindowCloseClick}
				title={title}
				windowKey={key}
				withoutTilte={!title}
				zIndex={index}
			/>
		);
	}
}

export default WindowsContainer;