import React from "react";
import PropTypes from 'prop-types';
import Icon from '../../atoms/Icon'
import HoldButton from '../../../presentation/atoms/HoldButton'
import './mapLegend.scss';
class MapLegend extends React.PureComponent {

    handleLedendClick() {
        if (this.props.isOpen) {
			this.props.closeWindow();
		} else {
			this.props.openWindow();
		}
    }

    render () {
        return (
                <div className="legend-control control">
                    <HoldButton 
                            onClick={() => {this.handleLedendClick()}}
                            onMouseDown={200}
                            pressCallbackTimeout={20}
                            finite={false}
                        >
                        <Icon icon='legend'/>
                    </HoldButton>
                </div>
        )
    }
}


MapLegend.defaultProps = {
    activeMapKey: '',
    navigator: {},
    setNavigator: () => {},
    resetHeading: () => {},
  };
  
MapLegend.propTypes = {
    navigator: PropTypes.object,
    setNavigator: PropTypes.func,
    resetHeading: PropTypes.func,
    activeMapKey:PropTypes.string,
};

export default MapLegend;