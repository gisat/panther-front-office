import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import WorldWindMap from "../Deprecated_WorldWindMap";

import './style.css';

class MapSet extends React.PureComponent {

	static propTypes = {
		mapSetKey: PropTypes.string,
		maps: PropTypes.array,
		layerTreesFilter: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.ref = React.createRef();
	}

	render() {
		return (
			<div className="ptr-map-set" ref={this.ref}>
				{this.renderMaps()}
			</div>
		);
	}

	renderMaps() {
		let availableWidth = this.props.width;
		let availableHeight = this.props.height;
		if (!availableWidth) availableWidth = this.ref.current && this.ref.current.clientWidth;
		if (!availableHeight) availableHeight = this.ref.current && this.ref.current.clientHeight;

		if (this.props.maps && this.props.maps.length && availableWidth && availableHeight) {
			let sizeRatio = availableWidth/availableHeight;
			let numOfMaps = this.props.maps.length;
			let rows = 1, columns = 1;

			switch (numOfMaps) {
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

			return this.props.maps.map((mapKey, index) => {
				let content = null;
				const mapProps = {
					key: mapKey,
					mapKey: mapKey,
					elevationModel: null,
					delayedWorldWindNavigatorSync: null, // miliseconds to wait until synchronize navigator change with store
					layerTreesFilter: this.props.layerTreesFilter
				};

				if(this.props.children) {
					const {children, ...propsWithoutChildren} = this.props;
					content = React.cloneElement(this.props.children, {...mapProps, ...propsWithoutChildren});
				} else {
					content = <WorldWindMap {...mapProps}/>
				}

				index++;
				let rowNo = Math.ceil(index / columns);
				let colNo = index % columns || columns;

				let wrapperClasses = classNames("ptr-map-wrapper", "row"+rowNo, "col"+colNo);

				return <div key={mapKey} className={wrapperClasses} style={style}>{content}</div>
			});
		} else {
			return null;
		}
	}
}

export default MapSet;
