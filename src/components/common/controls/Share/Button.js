import React from 'react';
import PropTypes from 'prop-types';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import { connect } from 'react-redux';


import Button from '../../../presentation/atoms/Button';


const mapStateToProps = (state, props) => {
    
    return {
        floaterVisible: Select.components.windows.isWindowOpen(state, {key: 'share'})
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
        return (
            <Button onClick={this.onButtonClick}>
                <i className={'fa fa-share-alt'}>
                </i>
            </Button>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareButton);