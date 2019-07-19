import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import mapUtils from "../../../utils/map";

const DEFAULT_VIEW = {
	center: {
		lat: 45,
		lon: 10
	},
	boxRange: 10000000,
	tilt: 0,
	roll: 0,
	heading: 0
};

class PresentationMapWithControls extends React.PureComponent {
	static propTypes = {
		map: PropTypes.element,
		controls: PropTypes.element
	};

	constructor(props) {
		super(props);

		this.state = {
			view: {...DEFAULT_VIEW, ...(props.map && props.map.props && props.map.props.view)}
		};

		this.updateView = this.updateView.bind(this);
		this.resetHeading = this.resetHeading.bind(this);
	}

	componentDidMount() {

	}

	componentDidUpdate(prevProps) {
		const props = this.props;
		if (props.map && props.map.props && props.map.props.view) {
			if (prevProps && prevProps.map && prevProps.map.props && prevProps.map.props.view) {
				if (!_.isEqual(props.map.props.view, prevProps.map.props.view)) {
					this.setState({
						view: {...DEFAULT_VIEW, ...(props.map && props.map.props && props.map.props.view)}
					});
				}
			} else {
				this.setState({
					view: {...DEFAULT_VIEW, ...(props.map && props.map.props && props.map.props.view)}
				});
			}
		}
	}

	resetHeading() {
		mapUtils.resetHeading(this.state.view.heading, (heading) => this.setState({
			view: {...this.state.view, heading}
		}));
	}

	updateView(update) {
		this.setState({
			view: {...this.state.view, ...update}
		});
	}

	render() {
		return (
			<div className="ptr-presentation-map-with-controls" style={{height: '100%', position: 'relative'}}>
				{React.cloneElement(this.props.map, {
					...this.props.map.props,
					view: {...this.props.map.props.view, ...this.state.view},
					onViewChange: this.updateView
				})}
				{React.cloneElement(this.props.controls, {
					...this.props.controls.props,
					view: this.state.view,
					updateView: this.updateView,
					resetHeading: this.resetHeading
				})}
			</div>
		);

	}
}

export default PresentationMapWithControls;
