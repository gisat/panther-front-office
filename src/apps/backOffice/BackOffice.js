import React from 'react';
import {withNamespaces} from "react-i18next";
import utils from '../../utils/utils';
import Screens from '../../components/common/Screens';

class BackOffice extends React.PureComponent {
	render() {
		return (
			<Screens
				setKey="backOffice"
			>
			</Screens>
		);
	}
}

export default withNamespaces()(BackOffice);