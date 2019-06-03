import React from 'react';

const copy = (text, e) => {
	navigator.clipboard.writeText(text);
	e.stopPropagation();
};

export default props => {
	if (!props.value || typeof props.value !== "string") return null;

	let shortKey = props.value.substring(0, 4);
	return (
		<span
			className="option-id"
			title={props.value}
			onClick={copy.bind(null, props.value)}
		>
			{shortKey}
	  </span>
	);
}