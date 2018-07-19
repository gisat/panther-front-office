import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from "../../../atoms/Button";
import ChangeReviewsTable from "../ChangeReviewsTable/ChangeReviewsTable";
import Icon from "../../../atoms/Icon";
import InputText from "../../../atoms/InputText/InputText";

import './ChangeReviewsList.css';

class ChangeReviewsList extends React.PureComponent {

	static propTypes = {
		cases: PropTypes.array
	};

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
					<ChangeReviewsTable
						cases={this.props.cases}
					/>
				</div>
			</div>
		);
	}
}

export default ChangeReviewsList;