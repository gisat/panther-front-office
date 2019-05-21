import React from "react";
import PropTypes from 'prop-types';
import Icon from '../../atoms/Icon'
import HoldButton from '../../../presentation/atoms/HoldButton/'
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
                <div className="legend-control control" title = "Legend">
                    <HoldButton 
                            onClick={() => {this.handleLedendClick()}}
                            finite={true}
                            disabled={this.props.disabled}
                        >
                        <Icon icon='legend'/>
                    </HoldButton>
                </div>
        )
    }
}


MapLegend.defaultProps = {
    disabled: false,
    isOpen: false,
  };
  
MapLegend.propTypes = {
    disabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeWindow: PropTypes.func,
    openWindow: PropTypes.func
};

export default MapLegend;