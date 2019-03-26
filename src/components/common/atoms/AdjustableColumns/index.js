import React from "react";

import "./style.scss";

const renderColumn = column => {

	let style = {};
	if (column.width) {
		style.width = column.width; // naive for now
		style.flexGrow = 0;
	} else {
		style.flex = 1;
	}

	let content = null;
	if (column.component) {
		content = React.createElement(column.component);
	} else if (column.render) {
		content = column.render();
	}

	return (<div className="ptr-adjustable-column" style={style}><div>{content}</div></div>);
};

export default props => (
	<div className="ptr-adjustable-columns">
		{props && props.content && props.content.length && props.content.map(renderColumn) || null}
	</div>
);