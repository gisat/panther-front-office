import React from 'react';
import PropTypes from 'prop-types';
import SelectBase from 'react-select';
import SelectCreatable from 'react-select';
import classnames from 'classnames';
import _ from 'lodash';

import './select.scss';
import Key from "./Key";

class Select extends React.PureComponent {

    static propTypes = {
        className: PropTypes.string, // className for the outer element
        components: PropTypes.object,
        formatOptionLabel: PropTypes.func, // custom option rendering
        onChange: PropTypes.func, // onChange handler: function (newValue) {}
        options: PropTypes.array,
        optionLabel: PropTypes.string, // path to label
        optionValue: PropTypes.string, // path to value
        type: PropTypes.string,
        unfocusable: PropTypes.bool,
        value: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        valueIsTitle: PropTypes.bool,
        withKeyPrefix: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.getLabel = this.getLabel.bind(this);
        this.getOptionLabel = this.getOptionLabel.bind(this);
        this.getOptionValue = this.getOptionValue.bind(this);
    }
    
    render() {
        let props = {...this.props};

        const classes = classnames(`ptr-select-container ${this.props.className}`, {
            'value-is-title': !!this.props.valueIsTitle,
        });

        if (!props.optionValue) {
            props.optionValue = 'value';
        }

        if (typeof props.value === 'string') {
            if (props.optionValue) {
                props.value = _.find(props.options, (option) => {return _.get(option, props.optionValue) === props.value});
            } else {
                props.value = _.find(props.options, {label: props.value});
            }
        }

        switch (this.props.type) {
            case 'creatable':
                return this.renderCreatable(props, classes);
            default:
                return this.renderBase(props, classes);
        }
    }

    renderBase(props, classes) {
        return (
            <SelectBase
                className={classes}
                classNamePrefix={'ptr-select'}
                components={props.components}
                formatOptionLabel={this.getLabel}
                getOptionValue={this.getOptionValue}
                getOptionLabel={this.getOptionLabel}
                hideSelectedOptions={props.hideSelectedOptions}
                onChange={props.onChange}
                options={props.options}
                tabIndex={props.unfocusable ? -1 : 0}
                value={props.value}
            />
        );
    }

    // TODO not documented
    renderCreatable(props, classes) {
        return (
            <SelectCreatable
                className={classes}
                classNamePrefix={'ptr-select'}
                components={props.components}
                formatOptionLabel={this.getLabel}
                getOptionValue={this.getOptionValue}
                hideSelectedOptions={props.hideSelectedOptions}
                onChange={props.onChange}
                options={props.options}
                tabIndex={props.unfocusable ? -1 : 0}
                value={props.value}
            />
        )
    }

    getLabel(option) {
        if (this.props.formatOptionLabel) {
            return this.props.formatOptionLabel(option);
        } else {
            let labelPrefix = null;
            let labelText = this.getOptionLabel(option);

            if (this.props.withKeyPrefix) {
                labelPrefix = (<Key value={this.getOptionValue(option)}/>)
            }

            return (
                <div className="label" key='label'>
                    {labelPrefix}
                    {labelText}
                </div>
            );
        }
    }

    getOptionLabel(option) {
        if (this.props.optionLabel) {
            return _.get(option, this.props.optionLabel);
        } else if (option.label) {
            return option.label;
        }
    }

    getOptionValue(option) {
        if (this.props.optionValue) {
            return _.get(option, this.props.optionValue);
        } else if (option.value) {
            return option.value;
        }
    }
}

export default Select;