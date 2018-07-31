import React from 'react';
import PropTypes from 'prop-types';

import Action from '../../../../../state/Action';

import _ from 'lodash';

import Button from "../../../../presentation/atoms/Button";
import Icon from "../../../../presentation/atoms/Icon";
import InputText from "../../../../presentation/atoms/InputText/InputText";
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
					<div className="ptr-change-review-form-buttons">
						<Button icon="arrow-left" invisible onClick={this.onClickBack}>
							Změnová řízení
						</Button>
					</div>
					<h2 className="ptr-change-review-form-title">Nové řízení</h2>
				</div>
				<div className="ptr-change-review-form-body">
					<div>
						<label>submit_date</label>
						<input name="submit_date" type="text" value={data.submit_date || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>code_dpb</label>
						<input name="code_dpb" type="text" value={data.code_dpb || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>code_ji</label>
						<input name="code_ji" type="text" value={data.code_ji || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>case_key</label>
						<input name="case_key" type="text" value={data.case_key || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>change_description</label>
						<input name="change_description" type="text" value={data.change_description || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>change_description_place</label>
						<input name="change_description_place" type="text" value={data.change_description_place || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>change_description_other</label>
						<input name="change_description_other" type="text" value={data.change_description_other || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>evaluation_result</label>
						<input name="evaluation_result" type="text" value={data.evaluation_result || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>evaluation_description</label>
						<input name="evaluation_description" type="text" value={data.evaluation_description || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>evaluation_description_other</label>
						<input name="evaluation_description_other" type="text" value={data.evaluation_description_other || ""}
							   onChange={this.onFormChange}/>
					</div>
					<div>
						<label>evaluation_used_sources</label>
						<input name="evaluation_used_sources" type="text" value={data.evaluation_used_sources || ""}
							   onChange={this.onFormChange}/>
					</div>

					<div>
						<label>geometry_before</label>
						<input id="geometry_before" name="geometry_before" type="file" onChange={this.onFormChange}/>
					</div>
					<div>
						<label>geometry_after</label>
						<input id="geometry_after" name="geometry_after" type="file" onChange={this.onFormChange}/>
					</div>
					<div>
						<input type="button" value="Podat a vytvořit nový" onClick={this.onClickSendAndCreateNewOne}/>
					</div>
					<div>
						<input type="button" value="Podat a vrátit na seznam" onClick={this.onClickSendAndReturnBack}/>
					</div>
				</div>
			</div>
		);
	}
}

export default ChangeReviewForm;