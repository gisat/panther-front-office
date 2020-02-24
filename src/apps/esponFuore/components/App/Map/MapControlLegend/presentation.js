import React from "react";
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {Icon} from '@gisatcz/ptr-atoms'
import HoldButton from '../../../../../../components/presentation/atoms/HoldButton'
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
        let classes = classnames("legend-control control", {
            open: this.props.isOpen
        });

        return (
                <div className={classes} title = "Legend">
                    <HoldButton 
                            onClick={() => {this.handleLedendClick()}}
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