import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';

import Page from '../../../Page';

class LayersDoc extends React.PureComponent {
	
	render() {
		return (
			<Page title="Layers">
				Layers
			</Page>
		);
	}
}

export default withNamespaces()(LayersDoc);