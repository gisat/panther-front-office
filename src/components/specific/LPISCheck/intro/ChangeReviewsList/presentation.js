import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ChangeReviewsTable from "../CheckTable/ChangeReviewsTable";
import Icon from "../../../../common/atoms/Icon";
import InputText from "../../../../common/atoms/Input/Input";

import './style.css';

class ChangeReviewsList extends React.PureComponent {

	static propTypes = {
		cases: PropTypes.array,
		changeSearch: PropTypes.func,
		showCase: PropTypes.func,
		searchString: PropTypes.string,
		filterVisited: PropTypes.string,
		filterConfirmed: PropTypes.string,
	};

	onSearchChange(searchString){
		this.props.changeSearch({
			name: 'searchString',
			value: searchString,
		});
	}

	render() {
		return (
			<div className="ptr-change-reviews-list">
				<div className="ptr-change-reviews-list-header">
					<h2 className="ptr-change-reviews-list-title">Kontrola LPIS</h2>
					<div className="ptr-change-reviews-list-buttons">
						<InputText
							placeholder="Vyhledat"
							transparent
							onChange={this.onSearchChange.bind(this)}
							value={this.props.searchString}
						>
							<Icon icon="search"/>
						</InputText>
					</div>
				</div>
				<div className="ptr-change-reviews-list-body">
					<ChangeReviewsTable
						cases={this.props.cases}
						onChangedFilter={this.props.changeSearch}
						showCase={this.props.showCase}
						filterVisited={this.props.filterVisited}
						filterConfirmed={this.props.filterConfirmed}
					/>
				</div>
			</div>
		);
	}
}

export default ChangeReviewsList;