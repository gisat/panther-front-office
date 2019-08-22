import React from 'react';
import Select from "../../../../components/common/atoms/Select/Select";
import ValueContainer from './valueContainer';
import './style.scss';

const LayerSelect = ({ children, ...props }) => {
  const {onChange, options, optionLabel, optionValue, value, menuPortalTarget} = props;
  return (
    <Select
        className={'layers'}
        components={{ValueContainer}}
        onChange={onChange}
        options={options}
        optionLabel={optionLabel}
        optionValue={optionValue}
        value={value}
        menuPortalTarget={menuPortalTarget}
      />
  );
};

export default LayerSelect;