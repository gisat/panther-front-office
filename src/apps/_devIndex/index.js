import React from 'react';
import ReactDOM from 'react-dom';

import apps from '../../apps';

export default (hostname) => {

	ReactDOM.render(
		<div>
			<ul>
				{apps.map(app => app.backOffice ? null : (
					<li><a href={app.devPath}>{app.key}</a></li>
				))}
			</ul>
		</div>,
		document.getElementById('ptr')
	);

}