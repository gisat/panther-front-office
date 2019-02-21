import React from 'react';
import Icon from 'components/common/atoms/Icon';
import {components} from 'react-select';
import { css } from 'emotion';

const AddIndicator = (props) => {

	const onAddClickHandler = (evt) => {
		evt.preventDefault();
		evt.stopPropagation()
		props.onAddClick();
	}

	return (
		<span 
			className={'ptr-select__indicator ptr-select__indicator_add'}
			onMouseDown={onAddClickHandler}>
				<Icon icon={'plus'} width={16} height={16} viewBox={'0 0 32 32'} className={'hover'}/>
		</span>
	)
}


export default (props) => {
	const { children, className, cx, getStyles, selectProps } = props;
	const IndicatorSeparator = components.IndicatorSeparator;

	return (
	  <div
		className={cx(
		  css(getStyles('indicatorsContainer', props)),
		  {
			'indicators': true,
		  },
		  className
		)}
	  >
		{children}
		<IndicatorSeparator {...props}/>
		<AddIndicator onAddClick={() => {selectProps.onAddClick()}}/>
	  </div>
	);
  };