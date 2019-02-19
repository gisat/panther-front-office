import React from 'react';
import PropTypes from 'prop-types';
// import Select from 'react-select';
import SelectCreatable from 'react-select/lib/Creatable';
import Value from './Value';
import Icon from 'components/presentation/atoms/Icon';



class AddValue extends React.PureComponent {
    render() {


        const startItems = [
            <span className={'ptr-icon-inline-wrap'} key={'double-angle'}>
                <Icon icon='plus' height={'32'}  width={'32'} className={'ptr-inline-icon'}/>
            </span>
        ];

        const endItems = [
            <span className={'ptr-icon-inline-wrap'} key={'double-angle'}>
                <Icon icon='angle-double-right' height={'16'}  width={'16'} className={'ptr-inline-icon'}/>
            </span>
        ];

        const className = this.props.option && this.props.option.className;
        const option = {
            label: this.props.option && this.props.option.label || 'Add item',
            className:`${className} ptr-option-add`,
            value: this.props.option && this.props.option.value || 'itemAdd',
        }
        debugger

        return (
            <Value 
                option={option}
                endItems = {endItems}
                startItems = {startItems}
                optionLabelClick = {true}
                onOptionLabelClick={this.props.onOptionLabelClick}
                />
        )
    }
}

export default AddValue;