import React from 'react';
import PropTypes from 'prop-types';

import Action from '../../../../../state/Action';

import _ from 'lodash';

import Button from "../../../atoms/Button";
import Icon from "../../../atoms/Icon";
import InputText from "../../../atoms/InputText/InputText";
import utils from "../../../../../utils/utils.js";

import './ChangeReviewForm.css';

class ChangeReviewForm extends React.PureComponent {

	static propTypes = {
		changeActiveScreen: PropTypes.func,
		createLpisCase: PropTypes.func,
		screenKey: PropTypes.string,
	};

	constructor(props){
		super(props);

		this.state = {
			form: {},
			files: {}
		};

		this.onClickBack = this.onClickBack.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onFormChange = this.onFormChange.bind(this);
	}

	onClickBack(){
		this.props.changeActiveScreen('changeReviewsList');
	}

	onFormSubmit(event) {
		event.preventDefault();
		this.props.createLpisCase(this.state.form, this.state.files);
	}

	onFormChange(event) {
		let key = event.target.name;
		let value = event.target.value;
		let files = event.target.files;

		if(key.toLowerCase().includes(`geometry`)) {
			let uuid = this.state.form[key] && this.state.form[key]['identifier'] ? this.state.form[key]['identifier'] : utils.guid();

			this.state.form[key] = {
				type: "file",
				identifier: uuid
			};

			this.state.files[uuid] = files[0];
		} else {
			this.state.form[key] = value;
		}
	}

	render() {
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
					<form onSubmit={this.onFormSubmit}>
						<input name="case_key" type="text" value={this.state.form.name} onChange={this.onFormChange}/>
						<input name="geometry_before" type="file" onChange={this.onFormChange}/>
						<input type="submit"/>
					</form>
				</div>
			</div>
		);
	}
}

export default ChangeReviewForm;