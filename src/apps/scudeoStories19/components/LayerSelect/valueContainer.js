import React from 'react';
import Select, { components } from 'react-select';
import Icon from "../../../../components/common/atoms/Icon";

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