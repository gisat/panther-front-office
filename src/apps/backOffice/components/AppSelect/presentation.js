import React from 'react';
import classNames from 'classnames';

import './style.scss';

const renderApp = app => (
	<div className="ptr-bo-app-select-item">{app.nameDisplay}</div>
);

export default props => (
	<>
		<div className="ptr-bo-app-select-current ptr-bo-app-select-item">
			<span>All apps</span>
		</div>
		<div className="ptr-bo-app-select-list">
			{props.apps && props.apps.length && props.apps.forEach(renderApp) || null}
		</div>
	</>
);
