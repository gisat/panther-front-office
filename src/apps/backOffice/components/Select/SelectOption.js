import React from 'react';
import { css } from 'emotion';
import Key from '../Key';
export default Option = (props) => {
    const { children, className, cx, getStyles, isDisabled, isFocused, isSelected, innerRef, innerProps } = props;
    const option = props.options.find(o => o.value === props.value);
    const key = props.options.find(o => o.value === props.value).key;

    const getLabel = () => {
		const labelText = option.renderer ? option.renderer(option) : option.label;
		const IDtooltip = option && option.key && option.key.length > 10 ? option.key : null;
		return (
			<span className="label" key='label'>
				<Key value={key} />
				<span>
					{labelText}
				</span>
			</span>)
	}

    return (
        <div
          ref={innerRef}
          className={cx(
            css(getStyles('option', props)),
            {
              'option': true,
              'option--is-disabled': isDisabled,
              'option--is-focused': isFocused,
              'option--is-selected': isSelected,
            },
            className
          )}
          {...innerProps}
        >
            {getLabel()}
        </div>
      );
  }