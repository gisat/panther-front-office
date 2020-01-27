import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import './style.scss';

class MapGrid extends React.PureComponent {
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
			<div className="ptr-map-grid" ref={this.ref}>
				{this.renderMaps()}
			</div>
		);
	}

	renderMaps() {
		let availableWidth = this.state.width;
		let availableHeight = this.state.height;

		if (this.props.children.length && availableWidth && availableHeight) {
			let sizeRatio = availableWidth/availableHeight;
			let rows = 1, columns = 1;

			switch (this.props.children.length) {
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
			const customWrapper = this.props.customWrapper;
			return this.props.children.map((map, index) => {
				index++;
				let rowNo = Math.ceil(index / columns);
				let colNo = index % columns || columns;

				let wrapperClasses = classNames("ptr-map-wrapper", "row"+rowNo, "col"+colNo, map.props.wrapperClasses);
				if(customWrapper) {
					return React.createElement(customWrapper, {classes: wrapperClasses, children: map, style: style, label: map.props.label, mapKey: map.props.mapKey});
				} else {
					const Map = <div key={'map-wrapper-' + index} className={wrapperClasses} style={style}>{map}</div>
					return Map;
				}
			});
		} else {
			return null;
		}
	}
}

export default MapGrid;
