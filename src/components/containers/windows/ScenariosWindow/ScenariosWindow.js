import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Window from "../../Window";

class ScenariosWindow extends React.PureComponent {

	render() {
		return (
			<Window
				window="scenarios"
				name="Scenarios"
				elementId="scenarios-window"
			>
				<div>scenarios</div>
			</Window>
		);
	}

}

export default ScenariosWindow;
