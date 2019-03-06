import React from 'react';
import classNames from 'classnames';

import './style.scss';

const renderApp = app => app.backOffice ? null : (
	<div className="ptr-bo-app-select-item"><span>{app.nameDisplay || app.key}</span></div>
);

export default props => (
	<>
		<div className="ptr-bo-app-select-current ptr-bo-app-select-item">
			<span>All apps</span>
		</div>
		<div className="ptr-bo-app-select-list">
			{props.apps && props.apps.length && props.apps.map(renderApp) || null}
		</div>
	</>
);
