import React from 'react';
import PropTypes from 'prop-types';
import SelectCreatable from 'react-select';
import {getLabel} from './utils';

import './select.scss';

class Select extends React.PureComponent {
    
    render() {
        const { selectedValue, options, components, className, onChange, customProps, unfocusable } = this.props;

        return (
                <SelectCreatable
                        tabIndex={unfocusable ? -1 : 0}
                        hideSelectedOptions={true}
                        components={components}
                        value={selectedValue}
                        onChange={onChange}
                        options={options}
                        isMulti={false}
                        getOptionValue={(option) => option.key}
                        className={`ptr-select-container ${className}`}
                        classNamePrefix={'ptr-select'}
                        formatOptionLabel={getLabel}
                        // menuIsOpen={true}
                        {...customProps}
                        />
        )
    }
}



Select.propTypes = {
    className: PropTypes.string,         // className for the outer element
    onChange: PropTypes.func,            // onChange handler: function (newValue) {}
    options: PropTypes.array,            // array of options
    components: PropTypes.object,
    customProps: PropTypes.object,
    selectedValue: PropTypes.object,
}

export default Select;