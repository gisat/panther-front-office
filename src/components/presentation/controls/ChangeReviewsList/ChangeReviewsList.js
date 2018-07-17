import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './ChangeReviewsList.css';
import Button from "../../atoms/Button";
import Icon from "../../atoms/Icon";
import InputText from "../../atoms/InputText/InputText";

class ChangeReviewsList extends React.PureComponent {

	static propTypes = {};

	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className="ptr-change-reviews-list">
				<div className="ptr-change-reviews-list-header">
					<h2 className="ptr-change-reviews-list-title">Změnová řízení</h2>
					<div className="ptr-change-reviews-list-buttons">
						<InputText
							placeholder="Vyhledat"
							transparent
						>
							<Icon icon="search"/>
						</InputText>
						<Button
							icon="plus"
							secondary>
							Přidat řízení
						</Button>
					</div>
				</div>
				<div className="ptr-change-reviews-list-body">
					<div className="ptr-table change-reviews-list-table">
						<div className="ptr-table-header">Název sloupce</div>
						<div className="ptr-table-body"></div>
					</div>
				</div>
			</div>
		);
	}
}

export default ChangeReviewsList;