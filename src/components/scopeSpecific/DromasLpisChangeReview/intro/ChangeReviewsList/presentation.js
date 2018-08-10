import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from "../../../../presentation/atoms/Button";
import ChangeReviewsTable from "../../../../presentation/controls/changeReviews/ChangeReviewsTable/ChangeReviewsTable";
import Icon from "../../../../presentation/atoms/Icon";
import InputText from "../../../../presentation/atoms/InputText/InputText";

import './style.css';
import Names from "../../../../../constants/Names";
import utils from "../../../../../utils/utils";

class ChangeReviewsList extends React.PureComponent {

	static propTypes = {
		cases: PropTypes.array,
		changeActiveScreen: PropTypes.func,
		changeSearchString: PropTypes.func,
		screenKey: PropTypes.string,
		searchString: PropTypes.string,
		createNewActiveEditedCase: PropTypes.func,
		activeEditedCaseKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		showCase: PropTypes.func,
		userGroup: PropTypes.string
	};

	addReview(){
		this.props.changeActiveScreen('changeReviewForm');

		if(!this.props.activeEditedCaseKey) {
			this.props.createNewActiveEditedCase();
		}
	}

	onSearchChange(searchString){
		this.props.changeSearchString(searchString);
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
							onChange={this.onSearchChange.bind(this)}
							value={this.props.searchString}
						>
							<Icon icon="search"/>
						</InputText>
						<Button
							icon="plus"
							secondary
							onClick={this.addReview.bind(this)}
						>
							{this.props.activeEditedCase && this.props.activeEditedCase.data && Object.keys(this.props.activeEditedCase.data).length ? 'Dokončit rozpracované řízení' : 'Přidat řízení'}
						</Button>
					</div>
				</div>
				<div className="ptr-change-reviews-list-body">
					<ChangeReviewsTable
						cases={this.props.cases}
						showCase={this.props.showCase}
						userGroup={this.props.userGroup}
					/>
				</div>
			</div>
		);
	}
}

export default ChangeReviewsList;