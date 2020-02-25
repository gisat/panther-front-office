import React from 'react';
import {withNamespaces} from '@gisatcz/ptr-locales';

import Page from "../Page";

const Index = props => (
	<Page>
		Hic sunt pantherae.
	</Page>
);

export default withNamespaces()(Index);