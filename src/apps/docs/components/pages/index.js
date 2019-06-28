import React from 'react';
import {withNamespaces} from "react-i18next";

import Page from "../Page";

const Index = props => (
	<Page>
		Hic sunt pantherae.
	</Page>
);

export default withNamespaces()(Index);