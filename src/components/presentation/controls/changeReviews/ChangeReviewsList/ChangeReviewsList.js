import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FuzzySearch from 'fuzzy-search';

import Button from "../../../atoms/Button";
import ChangeReviewsTable from "../ChangeReviewsTable/ChangeReviewsTable";
import Icon from "../../../atoms/Icon";
import InputText from "../../../atoms/InputText/InputText";

import './ChangeReviewsList.css';
import Names from "../../../../../constants/Names";
import utils from "../../../../../utils/utils";

class ChangeReviewsList extends React.PureComponent {

	static propTypes = {
		cases: PropTypes.array,
		changeActiveScreen: PropTypes.func,
		screenKey: PropTypes.string,
	};

	constructor(props){
		super(props);

		this.state = {
			cases: this.props.cases
		};
	}

	addReview(){
		this.props.changeActiveScreen('changeReviewForm');
	}

	onSearchChange(searchString){
		if (searchString.length > 0){
			let searcher = new FuzzySearch(this.props.cases, ['data.code_dpb', 'data.change_description_place']);
			this.setState({
				cases: searcher.search(searchString)
			});
		} else {
			this.setState({
				cases: this.props.cases
			});
		}
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
						>
							<Icon icon="search"/>
						</InputText>
						<Button
							icon="plus"
							secondary
							onClick={this.addReview.bind(this)}
						>
							Přidat řízení
						</Button>
					</div>
				</div>
				<div className="ptr-change-reviews-list-body">
					<ChangeReviewsTable
						cases={this.state.cases}
					/>
				</div>
			</div>
		);
	}
}

export default ChangeReviewsList;