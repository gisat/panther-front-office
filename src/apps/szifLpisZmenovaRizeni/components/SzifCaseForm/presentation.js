import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './style.scss';
import Button from "../../../../components/common/atoms/Button";

class SzifCaseForm extends React.PureComponent {
	static propTypes = {
		// cases: PropTypes.array,
		// changeActiveScreen: PropTypes.fun
	};

	componentDidMount() {
		// this.props.onMount();
	}

	render() {
		return (
			<div className="szifLpisZmenovaRizeni-szifCaseForm">
				form
				<Button onClick={() => {}}>Zpět</Button>
			</div>
		);
	}
}

export default SzifCaseForm;
