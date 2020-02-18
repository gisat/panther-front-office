import React from 'react';
import PropTypes from 'prop-types';

import fields from "../../../../../constants/LpisCaseFields";

import {utils} from '@gisatcz/ptr-utils';

import Button from "../../../../common/atoms/Button";
import InputFile from "../../../../common/atoms/InputFile/InputFile";
import InputText from "../../../../common/atoms/Input/Input";
import InputWrapper from "../../../../common/atoms/InputWrapper/InputWrapper";

import './style.css';

class ChangeReviewForm extends React.PureComponent {

	static propTypes = {
		changeActiveScreen: PropTypes.func,
		createLpisCase: PropTypes.func,
		screenKey: PropTypes.string,
		activeNewEditedCase: PropTypes.object,
		editActiveEditedCase: PropTypes.func,
		createNewActiveEditedCase: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.onClickBack = this.onClickBack.bind(this);
		this.onFormChange = this.onFormChange.bind(this);
		this.onClickSendAndCreateNewOne = this.onClickSendAndCreateNewOne.bind(this);
		this.onClickSendAndReturnBack = this.onClickSendAndReturnBack.bind(this);
		this.onClickClear = this.onClickClear.bind(this);
	}

	onClickBack() {
		this.props.changeActiveScreen('changeReviewsList');
	}

	onClickSendAndCreateNewOne() {
		if (this.validateForm()){
			this.props.createLpisCase();
			this.props.createNewActiveEditedCase();
			this.resetFileInputs();
		}
	}

	onClickSendAndReturnBack() {
		if (this.validateForm()){
			this.props.createLpisCase();
			this.props.changeActiveScreen('changeReviewsList');
			this.resetFileInputs();
		}
	}

	onClickClear() {
		this.props.clearActiveEditedCase();
	}

	validateForm() {
		let data = this.props.activeNewEditedCase.data;
		let files = this.props.activeNewEditedCase.files;
		if (!data.submit_date || data.submit_date.length === 0){
			window.alert(`Vyplňte pole ${fields["submit_date"].appName} !`);
			return false;
		}
		if (!data.code_dpb || data.code_dpb.length === 0){
			window.alert(`Vyplňte pole ${fields["code_dpb"].appName} !`);
			return false;
		}
		if (!data.code_ji || data.code_ji.length === 0){
			window.alert(`Vyplňte pole ${fields["code_ji"].appName} !`);
			return false;
		}
		if (!data.case_key || data.case_key.length === 0){
			window.alert(`Vyplňte pole ${fields["case_key"].appName} !`);
			return false;
		}
		if (!data.change_description || data.change_description.length === 0){
			window.alert(`Vyplňte pole ${fields["change_description"].appName} !`);
			return false;
		}
		if (!files || (!data.geometry_before && !data.geometry_after) || (
			(data.geometry_before && !files[data.geometry_before.identifier]) ||
				(data.geometry_after && !files[data.geometry_after.identifier])
			)
		){
			window.alert(`Nahrajte alespoň jeden ze souborů: ${fields["geometry_before"].appName} nebo ${fields["geometry_after"].appName}`);
			return false;
		}
		return true;
	}

	resetFileInputs() {
		document.getElementById(`geometry_before`).value = '';
		document.getElementById(`geometry_after`).value = '';
	}

	onTextInputChange(key, value){
		this.props.editActiveEditedCase(
			key,
			value
		);
	}

	onFormChange(event) {
		let key = event.target.name;
		let value = event.target.value;
		let files = event.target.files;

		if (key.toLowerCase().includes(`geometry`)) {
			let uuid = utils.uuid();
			this.props.editActiveEditedCase(
				key,
				{
					type: "file",
					identifier: uuid
				},
				{
					identifier: uuid,
					file: files[0]
				}
			);
		} else {
			this.props.editActiveEditedCase(
				key,
				value
			);
		}
	}

	render() {
		let data = this.props.activeNewEditedCase ? this.props.activeNewEditedCase.data : {};
		let files = this.props.activeNewEditedCase ? this.props.activeNewEditedCase.files : {};

		let geometryBeforeName = data && data.geometry_before && files && files[data.geometry_before.identifier] ? files[data.geometry_before.identifier].name : "Vyberte soubor...";
		let geometryAfterName = data && data.geometry_after && files && files[data.geometry_after.identifier] ? files[data.geometry_after.identifier].name : "Vyberte soubor...";

		return (
			<div className="ptr-change-review-form">
				<div className="ptr-change-review-form-header">
					<div className="ptr-change-review-form-header-buttons">
						<Button icon="arrow-left" invisible onClick={this.onClickBack}>
							Změnová řízení
						</Button>
					</div>
					<h2 className="ptr-change-review-form-title">Nové řízení</h2>
				</div>
				<div className="ptr-change-review-form-body">
					<div className="ptr-change-review-form-wrapper">
						<InputWrapper
							required="Povinné"
							label={fields["case_key"].appName}
						>
							<InputText
								text
								value={data.case_key || ""}
								onChange={this.onTextInputChange.bind(this, "case_key")}
							/>
						</InputWrapper>
						<InputWrapper
							label={fields["submit_date"].appName}
							required="Povinné"
						>
							<InputText
								date
								value={data.submit_date || ""}
								onChange={this.onTextInputChange.bind(this, "submit_date")}
							/>
						</InputWrapper>
						<InputWrapper
							required="Povinné"
							label={fields["code_dpb"].appName}
						>
							<InputText
								text
								value={data.code_dpb || ""}
								onChange={this.onTextInputChange.bind(this, "code_dpb")}
							/>
						</InputWrapper>
						<InputWrapper
							required="Povinné"
							label={fields["code_ji"].appName}
						>
							<InputText
								text
								value={data.code_ji || ""}
								onChange={this.onTextInputChange.bind(this, "code_ji")}
							/>
						</InputWrapper>
						<InputWrapper
							required="Povinné"
							label={fields["change_description"].appName}
						>
							<InputText
								multiline
								value={data.change_description || ""}
								onChange={this.onTextInputChange.bind(this, "change_description")}
							/>
						</InputWrapper>
						<InputWrapper
							label={fields["change_description_place"].appName}
						>
							<InputText
								multiline
								value={data.change_description_place || ""}
								onChange={this.onTextInputChange.bind(this, "change_description_place")}
							/>
						</InputWrapper>
						<InputWrapper
							label={fields["change_description_other"].appName}
						>
							<InputText
								multiline
								value={data.change_description_other || ""}
								onChange={this.onTextInputChange.bind(this, "change_description_other")}
							/>
						</InputWrapper>
						<InputWrapper
							required="Alespoň 1 soubor povinný"
							// label={fields["geometry_before"].appName}
							divInsteadOfLabel
							info={<p>Nahrajte alespoň jeden ze souborů! Soubor musí být ve formátu ZIP. Tento ZIP soubor musí obsahovat geometrie ve formátu shapefile. </p>}
						>
							<label>
								<span>{fields["geometry_before"].appName}</span>
								<InputFile
									accept=".zip"
									inputId="geometry_before"
									onChange={this.onFormChange}
									name="geometry_before"
								>
										<Button
											icon="upload"
											ghost
										>
											{geometryBeforeName}
										</Button>
								</InputFile>
							</label>
							<label>
								<span>{fields["geometry_after"].appName}</span>
								<InputFile
									accept=".zip"
									inputId="geometry_after"
									onChange={this.onFormChange}
									name="geometry_after"
								>
										<Button
											icon="upload"
											ghost
										>
											{geometryAfterName}
										</Button>
								</InputFile>
							</label>
						</InputWrapper>
					</div>


					<div className="ptr-change-review-form-buttons">
						<Button
							primary
							onClick={this.onClickSendAndCreateNewOne}
						>
							Uložit a vytvořit další
						</Button>
						<Button
							secondary
							onClick={this.onClickSendAndReturnBack}
						>
							Uložit a vrátit se na seznam
						</Button>
						<Button
							ghost
							onClick={this.onClickClear}
						>
							Vymazat formulář
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default ChangeReviewForm;