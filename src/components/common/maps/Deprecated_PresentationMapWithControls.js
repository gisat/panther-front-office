import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import mapUtils from "../../../utils/map";
import {defaultMapView} from './constants';

class Deprecated_PresentationMapWithControls extends React.PureComponent {
	static propTypes = {
		map: PropTypes.element,
		controls: PropTypes.element
	};

	constructor(props) {
		super(props);

		this.state = {
			view: {...defaultMapView, ...(props.map && props.map.props && props.map.props.view)}
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
						view: {...defaultMapView, ...(props.map && props.map.props && props.map.props.view)}
					});
				}
			} else {
				this.setState({
					view: {...defaultMapView, ...(props.map && props.map.props && props.map.props.view)}
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
		const view = {...this.state.view, ...update};

		if (!_.isEqual(view, this.state.view)) {
			this.setState({view});
		}
	}

	render() {
		return (
			<div className="ptr-presentation-map-with-controls" style={{height: '100%', position: 'relative'}}>
				{React.cloneElement(this.props.map, {
					...this.props.map.props,

					// TODO do not mutate view if it is not needed. Check if this is enough
					view: this.state.view,
					// view: {...(this.props.map.props && this.props.map.props.view), ...this.state.view},
					onViewChange: this.updateView
				})}
				{this.props.controls ? React.cloneElement(this.props.controls, {
					...this.props.controls.props,
					view: this.state.view,
					updateView: this.updateView,
					resetHeading: this.resetHeading
				}):null}
				{this.props.children}
			</div>
		);

	}
}

export default Deprecated_PresentationMapWithControls;
