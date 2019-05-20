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
                            finite={true}
                        >
                        <Icon icon='legend'/>
                    </HoldButton>
                </div>
        )
    }
}


MapLegend.defaultProps = {
  };
  
MapLegend.propTypes = {
    isOpen: PropTypes.func,
    closeWindow: PropTypes.func,
    openWindow: PropTypes.func
};

export default MapLegend;