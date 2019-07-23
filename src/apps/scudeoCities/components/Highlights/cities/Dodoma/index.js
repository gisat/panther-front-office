import React from 'react';
import PropTypes from 'prop-types';

import * as dodoma_au_level_1 from '../../../../data/EO4SD_DODOMA_AL1.json';
import * as dodoma_au_level_2 from '../../../../data/EO4SD_DODOMA_AL2.json';
import * as dodoma_au_level_3 from '../../../../data/EO4SD_DODOMA_AL3.json';

class Dodoma extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		return (
			<>
				Dodoma
			</>
		);
	}
}

export default Dodoma;

