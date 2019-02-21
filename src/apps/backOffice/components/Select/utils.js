import React from 'react';
import Key from '../Key';

/**
 * 
 * @param {*} option.renderer 
 * @param {*} option.key 
 * @param {*} option.data 
 * @param {*} option.data.nameDisplay 
 */
export const getLabel = (option) => {
    const labelText = option.renderer ? option.renderer(option) : option.label || option.data.nameDisplay;
    const IDtooltip = option && option.key && option.key.length > 10 ? option.key : null;
    const key = option.key;
    return (
      <span className="label" key='label'>
        <Key value={key} toottip={IDtooltip}/>
        <span>
          {labelText}
        </span>
      </span>
    )
  }