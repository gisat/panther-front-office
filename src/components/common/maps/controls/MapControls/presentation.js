import React from "react";
import PropTypes from 'prop-types';
import viewUtils from '../../viewUtils';
import {numberOfLevels as maxNumberOfLevels} from '../../constants';

import Icon from '../../../atoms/Icon';
import HoldButton from '../../../../presentation/atoms/HoldButton';
import './style.scss';

class MapControls extends React.PureComponent {

	static propTypes = {
		view: PropTypes.object,
		updateView: PropTypes.func,
		resetHeading: PropTypes.func,
		mapKey:PropTypes.string,
		zoomOnly: PropTypes.bool,
		levelsBased: PropTypes.bool
	};

	constructor() {
		super();

		this.tiltIncrement = 5;
		this.headingIncrement = 1.0;
		this.zoomIncrement = 0.04;
		this.exaggerationIncrement = 1;
	}

	handleTiltUp() {
		const update = {tilt: this.props.view.tilt - this.tiltIncrement};
		this.props.updateView(update, this.props.mapKey);
	};

	handleTiltDown() {
		const update = {tilt: this.props.view.tilt + this.tiltIncrement};
		this.props.updateView(update, this.props.mapKey);
	};

	handleHeadingRight() {
		const update = {heading: this.props.view.heading - this.headingIncrement};
		this.props.updateView(update, this.props.mapKey);
	}
	handleHeadingLeft() {
		const update = {heading: this.props.view.heading + this.headingIncrement};
		this.props.updateView(update, this.props.mapKey);
	}
	handleZoomIn() {
		let update = null;
		if (this.props.levelsBased && this.props.view && this.props.view.boxRange) {
			update = {boxRange: this.props.view.boxRange/2};
		} else {
			update = {boxRange: this.props.view.boxRange * (1 - this.zoomIncrement)};
		}
		this.props.updateView(update, this.props.mapKey);
	}

	handleZoomOut() {
		let update = null;
		if (this.props.levelsBased && this.props.view && this.props.view.boxRange) {
			update = {boxRange: this.props.view.boxRange*2};
		} else {
			update = {boxRange: this.props.view.boxRange * (1 + this.zoomIncrement)};
		}
		this.props.updateView(update, this.props.mapKey);
	}

	handleResetHeading() {
		this.props.resetHeading(this.props.mapKey);
	}

	handleExaggeratePlus() {
		// const update = {elevation: this.props.view.elevation + this.exaggerationIncrement};
		// this.props.updateView(update, this.props.mapKey);
	}

	handleExaggerateMinus() {
		// const update = {elevation: Math.max(1, this.props.view.elevation - this.exaggerationIncrement)};
		// this.props.updateView(update, this.props.mapKey);
	}

	render () {
		let currentZoomLevel = null;
		if (this.props.levelsBased && this.props.view && this.props.view.boxRange) {
			currentZoomLevel = viewUtils.getZoomLevelFromView(this.props.view);
		}

		// TODO different controls for 2D
		return (
			<div className="ptr-map-controls">
				{/* <div className="exaggerate-control control">
                        <HoldButton 
                            pressCallback={() => {this.handleExaggerateMinus()}}
                            onClick={() => {this.handleExaggerateMinus()}}
                            onMouseDown={200}
                            pressCallbackTimeout={20}
                            finite={false}
                        >
                            <Icon style={{transform: 'rotate(90deg)'}} icon='arrow-left' width={22} height={22} viewBox={'0 0 34 34'}/>
                        </HoldButton>
                        <HoldButton 
                            pressCallback={() => {this.handleExaggerateMinus()}}
                            onClick={() => {this.handleExaggerateMinus()}}
                            onMouseDown={200}
                            pressCallbackTimeout={20}
                            finite={false}
                        >
                            <Icon style={{transform: 'rotate(-90deg)'}} icon='arrow-left' width={22} height={22} viewBox={'0 0 34 34'}/>
                        </HoldButton>
                    </div> */}
				<div className="zoom-control control">
					<HoldButton
						pressCallback={() => {this.handleZoomIn()}}
						onClick={() => {this.handleZoomIn()}}
						onMouseDown={200}
						pressCallbackTimeout={20}
						finite={false}
						disabled={this.props.levelsBased && currentZoomLevel === maxNumberOfLevels}
					>
						<Icon icon='plus-thick'/>
					</HoldButton>
					<HoldButton
						pressCallback={() => {this.handleZoomOut()}}
						onClick={() => {this.handleZoomOut()}}
						onMouseDown={200}
						pressCallbackTimeout={20}
						finite={false}
						disabled={this.props.levelsBased && currentZoomLevel === 1}
					>
						<Icon icon='minus-thick'/>
					</HoldButton>
				</div>
				{!this.props.zoomOnly ? (
					<>
						<div className="rotate-control control">
							<HoldButton
								pressCallback={() => {this.handleHeadingRight()}}
								onClick={() => {this.handleHeadingRight()}}
								onMouseDown={200}
								pressCallbackTimeout={20}
								finite={false}
							>
								<Icon icon='rotate-right'/>
							</HoldButton>
							<HoldButton onClick={() => {this.handleResetHeading()}}>
								<Icon style={{transform: `rotate(${this.props.view ? -this.props.view.heading : 0}deg)`}} icon='north-arrow'/>
							</HoldButton>
							<HoldButton
								pressCallback={() => {this.handleHeadingLeft()}}
								onClick={() => {this.handleHeadingLeft()}}
								onMouseDown={200}
								pressCallbackTimeout={20}
								finite={false}
							>
								<Icon icon='rotate-left'/>
							</HoldButton>
						</div>
						<div className="tilt-control control">
							<HoldButton
								className="tilt-more-control"
								pressCallback={() => {this.handleTiltDown()}}
								onClick={() => {this.handleTiltDown()}}
								onMouseDown={200}
								pressCallbackTimeout={20}
								finite={false}
							>
								<Icon icon='tilt-more'/>
							</HoldButton>
							<HoldButton
								className="tilt-more-control"
								pressCallback={() => {this.handleTiltUp()}}
								onClick={() => {this.handleTiltUp()}}
								onMouseDown={200}
								pressCallbackTimeout={20}
								finite={false}
							>
								<Icon icon='tilt-less'/>
							</HoldButton>
						</div>
					</>
				) : null}
			</div>
		)
	}
}

export default MapControls;