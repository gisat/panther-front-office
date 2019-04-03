import React from 'react';
import PropTypes from 'prop-types';
import SelectBase from 'react-select';
import SelectCreatable from 'react-select/lib/Creatable';
import classnames from 'classnames';
import _ from 'lodash';

import './select.scss';
import Key from "./Key";
import utils from "../../../../utils/utils";

class Select extends React.PureComponent {

    static propTypes = {
        className: PropTypes.string, // className for the outer element
        components: PropTypes.object,
        disabled: PropTypes.bool,
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
        withKeyPrefix: PropTypes.bool,

        // creatable
        onCreate: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.getLabel = this.getLabel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCreate = this.onCreate.bind(this);
    }

    getFormattedOptions() {
        return this.props.options.map(option => {
            return {
                value: _.get(option, this.props.optionValue),
                label: _.get(option, this.props.optionLabel),
            };
        });
    }

    onChange(selectedObject) {
        if (this.props.optionValue) {
            let selected =  _.find(this.props.options, (option) => {
                return (_.get(option, this.props.optionValue) === selectedObject.value)
            });
            if (selected) {
                this.props.onChange(selected);
            } else {
                throw new Error('Select#Selected option was not found in original options.');
            }
        } else {
            this.props.onChange(selectedObject);
        }
    }

    onCreate(label) {
        let key = utils.uuid();
        if (this.props.optionValue && this.props.optionLabel) {
            let data = {};
            _.set(data, this.props.optionValue, key);
            _.set(data, this.props.optionLabel, label);
            this.props.onCreate(data);
        } else {
            this.props.onCreate({label: label, value: key});
        }
    }
    
    render() {
        let props = {...this.props};

        // prepare options
        if (!props.options) {
            props.options = [];
        } else if (props.optionLabel && props.optionValue) {
            props.options = this.getFormattedOptions();
        }

        // prepare selected value
        if (typeof props.value === 'string') {
            props.value = _.find(props.options, {value: props.value});
        }

        const classes = classnames(`ptr-select-container ${this.props.className}`, {
            'value-is-title': !!this.props.valueIsTitle,
            'disabled': this.props.disabled
        });

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
                hideSelectedOptions={props.hideSelectedOptions}
                isDisabled={this.props.disabled}
                onChange={this.onChange}
                options={props.options}
                tabIndex={props.unfocusable ? -1 : 0}
                value={props.value}
            />
        );
    }

    renderCreatable(props, classes) {
        return (
            <SelectCreatable
                className={classes}
                classNamePrefix={'ptr-select'}
                components={props.components}
                hideSelectedOptions={props.hideSelectedOptions}
                isDisabled={this.props.disabled}
                onChange={this.onChange}
                onCreateOption={this.onCreate}
                options={props.options}
                tabIndex={props.unfocusable ? -1 : 0}
                value={props.value}
            />
        )
    }

    getLabel(option) {
        if (this.props.formatOptionLabel) {
            if (this.props.optionValue) {
                let selected =  _.find(this.props.options, (opt) => {
                    return (_.get(opt, this.props.optionValue) === option.value)
                });
                if (selected) {
                    return this.props.formatOptionLabel(selected);
                } else {
                    throw new Error('Select#Selected option was not found in original options.');
                }
            } else {
                return this.props.formatOptionLabel(option);
            }
        } else {
            let labelPrefix = null;
            let labelText = option.label;

            if (this.props.withKeyPrefix) {
                labelPrefix = (<Key value={option.value}/>)
            }

            return (
                <div className="label" key='label'>
                    {labelPrefix}
                    {labelText}
                </div>
            );
        }
    }
}

export default Select;