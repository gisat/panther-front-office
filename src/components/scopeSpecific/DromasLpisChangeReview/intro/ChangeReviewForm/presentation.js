import React from 'react';
import PropTypes from 'prop-types';

import Action from '../../../../../state/Action';

import _ from 'lodash';

import Button from "../../../../presentation/atoms/Button";
import Icon from "../../../../presentation/atoms/Icon";
import InputText from "../../../../presentation/atoms/InputText/InputText";
import InputWrapper from "../../../../common/atoms/InputWrapper/InputWrapper";
import utils from "../../../../../utils/utils.js";

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
	}

	onClickBack() {
		this.props.changeActiveScreen('changeReviewsList');
	}

	onClickSendAndCreateNewOne() {
		this.props.createLpisCase();
		this.props.createNewActiveEditedCase();
		this.resetFileInputs();
	}

	onClickSendAndReturnBack() {
		this.props.createLpisCase();
		this.props.changeActiveScreen('changeReviewsList');
		this.resetFileInputs();
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
			let uuid = utils.guid();
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
							label="Datum podání ohlášení"
						>
							<InputText
								date
								value={data.submit_date || ""}
								onChange={this.onTextInputChange.bind(this, "submit_date")}
							/>
						</InputWrapper>
						<InputWrapper
							label="Kód DPB"
						>
							<InputText
								text
								value={data.code_dpb || ""}
								onChange={this.onTextInputChange.bind(this, "code_dpb")}
							/>
						</InputWrapper>
						<InputWrapper
							label="Kód JI"
						>
							<InputText
								text
								value={data.code_ji || ""}
								onChange={this.onTextInputChange.bind(this, "code_ji")}
							/>
						</InputWrapper>
						<InputWrapper
							label="Spisová značka řízení"
						>
							<InputText
								text
								value={data.case_key || ""}
								onChange={this.onTextInputChange.bind(this, "case_key")}
							/>
						</InputWrapper>
						<InputWrapper
							label="Popis důvodu pro aktualizaci LPIS"
						>
							<InputText
								text
								value={data.change_description || ""}
								onChange={this.onTextInputChange.bind(this, "change_description")}
							/>
						</InputWrapper>
						<InputWrapper
							label="Určení místa změny v terénu"
						>
							<InputText
								text
								value={data.change_description_place || ""}
								onChange={this.onTextInputChange.bind(this, "change_description_place")}
							/>
						</InputWrapper>
						<InputWrapper
							label="Další informace"
						>
							<InputText
								text
								value={data.change_description_other || ""}
								onChange={this.onTextInputChange.bind(this, "change_description_other")}
							/>
						</InputWrapper>
					</div>

					<div>
						<label>geometry_before</label>
						<input id="geometry_before" name="geometry_before" type="file" onChange={this.onFormChange}/>
					</div>
					<div>
						<label>geometry_after</label>
						<input id="geometry_after" name="geometry_after" type="file" onChange={this.onFormChange}/>
					</div>
					<div className="ptr-change-review-form-buttons">
						<Button
							primary
							onClick={this.onClickSendAndCreateNewOne}
						>
							Podat a vytvořit další
						</Button>
						<Button
							secondary
							onClick={this.onClickSendAndReturnBack}
						>
							Podat a vrátit se na seznam
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default ChangeReviewForm;