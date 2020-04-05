import React from 'react';
import './mapTools.scss';
export default (props) => {
	return (
		<div className="map-tools" style={{bottom: props.bottom}}>
			{props.children}
		</div>
	)
}