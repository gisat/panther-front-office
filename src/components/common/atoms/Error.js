import React from 'react';

import Center from './Center';

/**
 * Error component for use for developer errors in components
 */
export default props => {

	let {children, centered} = props;

	let message = (<div style={{background: "#f00",padding: "0 .5rem"}}>{children}</div>);

	if (centered) {
		return (
			<Center horizontally vertically>{message}</Center>
		);
	}

	return message;

};