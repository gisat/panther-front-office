import React from "react";
import PropTypes from 'prop-types';
import Icon from '../../../presentation/atoms/Icon'
import HoldButton from '../../../presentation/atoms/HoldButton'
import './mapControls.css';
class MapControls extends React.PureComponent {
    constructor() {
        super()

        this.tiltIncrement = 5;
        this.headingIncrement = 1.0;
        this.zoomIncrement = 0.04;
        this.exaggerationIncrement = 1;
      }

    handleTiltUp() {
        const updatedNavigator = {tilt: this.props.navigator.tilt - this.tiltIncrement}
        this.props.setNavigator(this.props.activeMapKey, updatedNavigator);
    };

    handleTiltDown() {
        const updatedNavigator = {tilt: this.props.navigator.tilt + this.tiltIncrement}
        this.props.setNavigator(this.props.activeMapKey, updatedNavigator);
    };

    handleHeadingRight() {
        const updatedNavigator = {heading: this.props.navigator.heading - this.headingIncrement}
        this.props.setNavigator(this.props.activeMapKey, updatedNavigator);
    }
    handleHeadingLeft() {
        const updatedNavigator = {heading: this.props.navigator.heading + this.headingIncrement}
        this.props.setNavigator(this.props.activeMapKey, updatedNavigator);
    }
    handleZoomIn() {
        const updatedNavigator = {range: this.props.navigator.range * (1 - this.zoomIncrement)};
        this.props.setNavigator(this.props.activeMapKey, updatedNavigator);
    }
    
    handleZoomOut() {
        const updatedNavigator = {range: this.props.navigator.range * (1 + this.zoomIncrement)};
        this.props.setNavigator(this.props.activeMapKey, updatedNavigator);
    }
    
    handleResetHeading() {
        this.props.resetHeading(this.props.activeMapKey);
    }
    
    handleExaggeratePlus() {
        // const updatedNavigator = {elevation: this.props.navigator.elevation + this.exaggerationIncrement};
        // this.props.setNavigator(this.props.activeMapKey, updatedNavigator);
    }

    handleExaggerateMinus() {
        // const updatedNavigator = {elevation: Math.max(1, this.props.navigator.elevation - this.exaggerationIncrement)};
        // this.props.setNavigator(this.props.activeMapKey, updatedNavigator);
    }

    render () {

        // TODO different controls for 2D
        return (
                <div className="map-controls">
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
                            >
                            <Icon icon='plus' width={22} height={22} viewBox={'0 0 34 34'}/>
                        </HoldButton>
                        <HoldButton 
                                pressCallback={() => {this.handleZoomOut()}}
                                onClick={() => {this.handleZoomOut()}}
                                onMouseDown={200}
                                pressCallbackTimeout={20}
                                finite={false}
                            >
                            <Icon icon='minus' width={22} height={22} viewBox={'0 0 34 34'}/>
                        </HoldButton>
                    </div>
                    <div className="rotate-control control">
                        <HoldButton 
                                pressCallback={() => {this.handleHeadingLeft()}}
                                onClick={() => {this.handleHeadingLeft()}}
                                onMouseDown={200}
                                pressCallbackTimeout={20}
                                finite={false}
                            >
                            <Icon icon='rotate-left-circular-arrow' width={22} height={22}/>
                        </HoldButton>
                        <button onClick={() => {this.handleResetHeading()}}>
                            <Icon icon='north-arrow' width={22} height={22}/>
                        </button>
                        <HoldButton 
                                pressCallback={() => {this.handleHeadingRight()}}
                                onClick={() => {this.handleHeadingRight()}}
                                onMouseDown={200}
                                pressCallbackTimeout={20}
                                finite={false}
                            >
                            <Icon icon='rotate-right-circular-arrow' width={22} height={22}/>
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
                                <Icon icon='tilt-more' width={22} height={22}/>
                            </HoldButton>
                            <HoldButton 
                                className="tilt-more-control"
                                pressCallback={() => {this.handleTiltUp()}}
                                onClick={() => {this.handleTiltUp()}}
                                onMouseDown={200}
                                pressCallbackTimeout={20}
                                finite={false}
                            >
                            <Icon icon='tilt-less' width={22} height={22}/>
                        </HoldButton>
                    </div>
                </div>
        )
    }
}


MapControls.defaultProps = {
    activeMapKey: '',
    navigator: {},
    setNavigator: () => {},
    resetHeading: () => {},
  };
  
MapControls.propTypes = {
    navigator: PropTypes.object.isRequired,
    setNavigator: PropTypes.func.isRequired,
    resetHeading: PropTypes.func.isRequired,
    activeMapKey:PropTypes.string.isRequired,
};

export default MapControls;