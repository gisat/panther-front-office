import React from 'react';
import PropTypes from 'prop-types';
import {Select, Action} from '@gisatcz/ptr-state';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {Button} from '@gisatcz/ptr-atoms';


const mapStateToProps = (state, props) => {
    
    return {
        floaterVisible: Select.components.windows.isWindowOpen(state, {key: 'share'}),
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		setFloaterVisible: (visible) => {
            dispatch(Action.components.windows.handleWindowVisibility('share', visible));
		},
	}
};

class ShareButton extends React.PureComponent{
    static propTypes = {
        setFloaterVisible: PropTypes.func,
        floaterVisible: PropTypes.bool,

    }

    constructor() {
        super();
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick () {
        this.props.setFloaterVisible(!this.props.floaterVisible);    
    }

    render () {
        const classes = classNames('header-button', {'secondary': this.props.floaterVisible});
        return (
            <Button onClick={this.onButtonClick} className={classes}>
                <span>
                    <i className={'fa fa-share-alt'}>
                    </i>
                </span>
            </Button>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareButton);