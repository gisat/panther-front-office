import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import ContainerMap from '../Map';

import './style.scss';

export class Map extends React.PureComponent {
	render() {
		return null;
	}
}

export class PresentationMap extends React.PureComponent {
	render() {
		return null;
	}
}

class MapSet extends React.PureComponent {

	static propTypes = {
		mapSetKey: PropTypes.string,
		maps: PropTypes.array,
		mapComponent: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.ref = React.createRef();

		this.state = {
			width: null,
			height: null
		}
	}

	componentDidMount() {
		this.resize();
		if (window) window.addEventListener('resize', this.resize.bind(this), {passive: true}); //todo IE
	}

	resize() {
		if (this.ref && this.ref.current) {
			let width = this.ref.current.clientWidth;
			let height = this.ref.current.clientHeight;

			this.setState({
				width, height
			});
		}
	}

	render() {
		return (
			<div className="ptr-map-set" ref={this.ref}>
				<div className="ptr-map-set-maps">
					{this.renderMaps()}
				</div>
				<div className="ptr-map-set-controls">
					{this.renderControls()}
				</div>
			</div>
		);
	}

	renderControls() {
		return React.Children.map(this.props.children, child => {
			if (!(typeof child === "object" && child.type === Map)) {
				return React.cloneElement(child);
			}
		});
	}

	renderMaps() {
		let availableWidth = this.state.width;
		let availableHeight = this.state.height;

		let maps = [];

		// For now, render either maps from state, OR from children
		if (this.props.maps && this.props.maps.length) {
			this.props.maps.map(mapKey => {
				let props = {
					key: mapKey,
					mapKey: mapKey
				};
				maps.push(React.createElement(ContainerMap, {...props, mapComponent: this.props.mapComponent}));
			});
		} else {
			React.Children.map(this.props.children, child => {
				if (typeof child === "object" && child.type === Map) {
					maps.push(React.createElement(ContainerMap, {...child.props, mapComponent: this.props.mapComponent}));
				} else if (typeof child === "object" && child.type === PresentationMap) {
					maps.push(React.createElement(this.props.mapComponent, child.props));
				}
			});
		}

		if (maps.length && availableWidth && availableHeight) {
			let sizeRatio = availableWidth/availableHeight;
			let rows = 1, columns = 1;

			switch (maps.length) {
				case 1:
					break;
				case 2:
					if (sizeRatio > 1) {
						columns = 2;
					} else {
						rows = 2;
					}
					break;
				case 3:
					if (sizeRatio > 2) {
						columns = 3;
					} else if (sizeRatio < 0.6666) {
						rows = 3;
					} else {
						columns = 2;
						rows = 2;
					}
					break;
				case 4:
					if (sizeRatio > 3) {
						columns = 4;
					} else if (sizeRatio < 0.5) {
						rows = 4;
					} else {
						columns = 2;
						rows = 2;
					}
					break;
				case 5:
				case 6:
					if (sizeRatio > 1) {
						columns = 3;
						rows = 2;
					} else {
						columns = 2;
						rows = 3;
					}
					break;
				case 7:
				case 8:
					if (sizeRatio > 2) {
						columns = 4;
						rows = 2;
					} else if (sizeRatio < 0.6666) {
						columns = 2;
						rows = 4;
					} else {
						columns = 3;
						rows = 3;
					}
					break;
				case 9:
					if (sizeRatio > 2.5) {
						columns = 5;
						rows = 2;
					} else if (sizeRatio < 0.5) {
						columns = 2;
						rows = 5;
					} else {
						columns = 3;
						rows = 3;
					}
					break;
				default:
					if (sizeRatio > 1) {
						columns = 4;
						rows = 3;
					} else {
						columns = 3;
						rows = 4;
					}
			}

			let width = +(100 / columns).toFixed(4) + '%';
			let height = +(100 / rows).toFixed(4) + '%';

			let style = {width, height};

			return maps.map((map, index) => {
				index++;
				let rowNo = Math.ceil(index / columns);
				let colNo = index % columns || columns;

				let wrapperClasses = classNames("ptr-map-wrapper", "row"+rowNo, "col"+colNo);

				return <div key={'map-wrapper-' + index} className={wrapperClasses} style={style}>{map}</div>
			});
		} else {
			return null;
		}
	}
}

export default MapSet;
