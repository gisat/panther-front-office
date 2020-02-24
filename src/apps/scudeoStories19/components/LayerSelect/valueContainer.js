import React from 'react';
import Select, { components } from 'react-select';
import {Icon} from '@gisatcz/ptr-atoms';

const Input = ({ children, ...props }) => {
  return (
    <>
        <components.ValueContainer {...props}>
          {/* <span> */}
            <Icon icon={'layers'}/>
          {/* </span> */}
          {children}
        </components.ValueContainer>
    </>
  );
};

export default Input;