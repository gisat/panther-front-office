import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from "../../../atoms/Button";
import Icon from "../../../atoms/Icon";
import InputText from "../../../atoms/InputText/InputText";

import './ChangeReviewForm.css';

class ChangeReviewForm extends React.PureComponent {

	static propTypes = {
		changeActiveScreen: PropTypes.func,
		screenKey: PropTypes.string,
	};

	constructor(props){
		super(props);

		this.onClickBack = this.onClickBack.bind(this);
	}

	onClickBack(){
		this.props.changeActiveScreen('changeReviewsList');
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
				<div className="ptr-change-review-form-body"></div>
			</div>
		);
	}
}

export default ChangeReviewForm;