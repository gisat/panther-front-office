import React from 'react';
import mapUtils from "../../../utils/map";
import LeafletMap from "../../../components/common/maps/LeafletMap/presentation";
import MapSet from "../../../components/common/maps/MapSet/presentation";

const BASE_MAP_SIZE = 1400; // size of map container in px, for which the view is calibrated

class AdjustViewOnResizeLeafletWrapper extends React.PureComponent {
	constructor(props) {
		super(props);
		this.ref = React.createRef();

		this.state = {
			mapSizeRatio: 1,
		};
	}

	componentDidMount() {
		if (window) window.addEventListener('resize', this.resize.bind(this), {passive: true});
		this.resize();
	}

	resize() {
		if (this.ref && this.ref.current) {
			let width = this.ref.current.clientWidth;
			let height = this.ref.current.clientHeight;
			let minSize = Math.min(width, height);
			this.setState({mapSizeRatio: BASE_MAP_SIZE/minSize});
		}
	}

	getView(geometry, reflectLatitude) {
		let view = mapUtils.getViewFromGeometry(geometry, reflectLatitude);

		// TODO leaflet map doesn't adapt box range to map container size, solve it in LeafletMap component
		view.boxRange *= this.state.mapSizeRatio;

		return view;
	}


	render() {
		return (
			<div ref={this.ref}>
				{
					React.Children.map(this.props.children, child => {
						if (child.props && child.props.map && child.props.map.type === LeafletMap) {
							return React.cloneElement(child, {map: React.cloneElement(child.props.map, {view: this.getView(this.props.geometry, true)})});
						} else if (child.type === MapSet) {
							return React.cloneElement(child, {view: this.getView(this.props.geometry, true)});
						} else {
							return child;
						}
					})
				}
			</div>
		);
	}
}

export default AdjustViewOnResizeLeafletWrapper;

