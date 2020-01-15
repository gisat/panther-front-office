import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './style.scss';
import Button from "../../../../components/common/atoms/Button";
import InputWrapper from "../../../../components/common/atoms/InputWrapper/InputWrapper";
import Input from "../../../../components/common/atoms/Input/Input";

class SzifCaseForm extends React.PureComponent {
	static propTypes = {
		// cases: PropTypes.array,
		// changeActiveScreen: PropTypes.fun
		updateEdited: PropTypes.func,
		activeNewEditedCase: PropTypes.object,
	};

	onChange(key, value) {
		this.props.updateEdited(key, value);
	}

	componentDidMount() {
		// this.props.onMount();
	}

	render() {
		let data = this.props.activeNewEditedCase ? this.props.activeNewEditedCase.data : {};
		let files = this.props.activeNewEditedCase ? this.props.activeNewEditedCase.files : {};

		let geometryBeforeName = data && data.geometry_before && files && files[data.geometry_before.identifier] ? files[data.geometry_before.identifier].name : "Vyberte soubor...";
		let geometryAfterName = data && data.geometry_after && files && files[data.geometry_after.identifier] ? files[data.geometry_after.identifier].name : "Vyberte soubor...";

		return (
			<div className="szifLpisZmenovaRizeni-szifCaseForm">
				<InputWrapper
					required
					label={'Název řízení'}
				>
					<Input
						value={data && data.case_key || ""}
						onChange={(val) => this.onChange('case_key', val)}
					/>
				</InputWrapper>
				<InputWrapper
					label={'Datum podání ohlášení'}
				>
					<Input
						date
						value={data && data.nameInternal || ""}
						onChange={(val) => this.onChange('submit_date', val)}
					/>
				</InputWrapper>

				<div className="ptr-bo-screen-buttons">
					<div className="ptr-bo-screen-buttons-left">
						<Button
							// disabled={this.props.unfocusable || !this.props.editedData || _.isEmpty(this.props.editedData)}
							disabled={true}
							ghost
							primary
							onClick={this.props.onSave}
						>{'Uložit'}</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default SzifCaseForm;
