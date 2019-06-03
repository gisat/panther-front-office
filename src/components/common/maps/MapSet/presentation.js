import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import WorldWindMap from "../WorldWindMap";

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
			let width = '100%';
			let height = '100%';

			switch (numOfMaps) {
				case 1:
					break;
				case 2:
					if (sizeRatio > 1) {
						width = '50%'
					} else {
						height = '50%'
					}
					break;
				case 3:
					if (sizeRatio > 2) {
						width = '33.3333%'
					} else if (sizeRatio < 0.6666) {
						height = '33.3333%'
					} else {
						width = '50%';
						height = '50%';
					}
					break;
				case 4:
					if (sizeRatio > 3) {
						width = '25%';
					} else if (sizeRatio < 0.5) {
						height = '25%';
					} else {
						width = '50%';
						height = '50%';
					}
					break;
				case 5:
				case 6:
					if (sizeRatio > 1) {
						width = '33.3333%';
						height = '50%'
					} else {
						width = '50%';
						height = '33.3333%';
					}
					break;
				case 7:
				case 8:
					if (sizeRatio > 2) {
						width = '25%';
						height = '50%';
					} else if (sizeRatio < 0.6666) {
						width = '50%';
						height = '25%';
					} else {
						width = '33.3333%';
						height = '33.3333%';
					}
					break;
				case 9:
					if (sizeRatio > 2.5) {
						width = '20%';
						height = '50%';
					} else if (sizeRatio < 0.5) {
						width = '50%';
						height = '20%';
					} else {
						width = '33.3333%';
						height = '33.3333%';
					}
					break;
				default:
					if (sizeRatio > 1) {
						width = '25%';
						height = '33.3333%';
					} else {
						height = '25%';
						width = '33.3333%';
					}
			}

			let style = {width, height};

			return this.props.maps.map(mapKey => {
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

				return <div key={mapKey} className="ptr-map-wrapper" style={style}>{content}</div>
			});
		} else {
			return null;
		}
	}
}

export default MapSet;
