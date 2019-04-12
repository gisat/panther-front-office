import React from "react";
import classNames from 'classnames';

import "./style.scss";

const renderColumn = (column, index) => {

	let style = {};
	if (column.width) {
		style.width = column.width; // naive for now
		style.flexGrow = 0;
	} else {
		style.flex = 1;
	}

	let content = null;
	if (column.component) {
		content = React.createElement(column.component, column.props);
	} else if (column.render) {
		content = column.render();
	}

	let handle = null;
	if (index) {
		handle = (<div className={"ptr-adjustable-column-handle handle" + index}><div/></div>)
	}

	return (<>{handle}<div className="ptr-adjustable-column" style={style}><div className="ptr-adjustable-columns-content">{content}</div></div></>);
};

export default props => (
	<div className={classNames("ptr-adjustable-columns", {fixed: props.fixed})}>
		{props && props.content && props.content.length && props.content.map(renderColumn) || null}
	</div>
);