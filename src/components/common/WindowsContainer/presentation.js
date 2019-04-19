import React from "react";
import PropTypes from "prop-types";
import Window from "./components/Window";

class WindowsContainer extends React.PureComponent {

	static propTypes = {
		onWindowClick: PropTypes.func,
		onWindowClose: PropTypes.func,
		onWindowDragStart: PropTypes.func,
		onWindowDragStop: PropTypes.func,
		onWindowResize: PropTypes.func,
		set: PropTypes.shape({
			orderByHistory: PropTypes.array
		}),
		windows: PropTypes.object
	};

	constructor (props) {
		super(props);

		this.state = {
			width: null,
			height: null
		};

		this.onWindowClick = this.props.onWindowClick.bind(this);
		this.onWindowCloseClick = this.onWindowCloseClick.bind(this);
		this.onWindowDragStart = this.onWindowDragStart.bind(this);
		this.onWindowDragStop = this.onWindowDragStop.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);

		this.ref = this.ref.bind(this);
		this.resize = this.resize.bind(this);
	}

	componentDidMount() {
		this.resize();
		if (window) window.addEventListener('resize', this.resize, {passive: true}); //todo IE
	}

	componentWillUnmount() {
		if (window) window.removeEventListener('resize', this.resize);
	}

	resize() {
		// TODO handle sizes in rem
		let pxWidth = null;
		let pxHeight = null;

		// get available width and height
		if (this.el && typeof this.el.clientWidth !== 'undefined' && typeof this.el.clientHeight !== 'undefined') {
			pxHeight = this.el.clientHeight;
			pxWidth = this.el.clientWidth;
		}

		if (pxWidth || pxHeight) {
			if (pxWidth !== this.state.width || pxHeight !== this.state.height) {
				this.setState({width: pxWidth, height: pxHeight});
			}
		}
	}

	ref(el) {
		this.el = el;
	}

	onWindowClick(windowKey) {
		this.props.onWindowClick(windowKey);
	}

	onWindowCloseClick(windowKey) {
		this.props.onWindowClose(windowKey);
	}

	onWindowDragStart(windowKey) {
		this.props.onWindowDragStart(windowKey);
	}

	onWindowDragStop(windowKey, position) {
		this.props.onWindowDragStop(windowKey, position);
	}

	onWindowResize(windowKey, width, height, position) {
		this.props.onWindowResize(windowKey, width, height, position);
	}

	// TODO what if any child is Window component?
	render() {
		return (
			<div className="ptr-windows-container" ref={this.ref}>
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
				containerHeight={this.state.height}
				containerWidth={this.state.width}
				content={content}
				onClick={this.onWindowClick}
				onCloseClick={this.onWindowCloseClick}
				onDragStart={this.onWindowDragStart}
				onDragStop={this.onWindowDragStop}
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