import React from 'react';
import PropTypes from 'prop-types';

import ChangeReviewsTableRow from './ChangeReviewsTableRow';

import './ChangeReviewsTable.css';


const VISITED_VALUES = [
	{
		key: 'all',
		name: 'Vše',
	},
	{
		key: 'unvisited',
		name: 'Neprohlédnuto',
	},
	{
		key: 'visited',
		name: 'Prohlédnuto',
	},
]

const CONFIRMED_VALUES = [
	{
		key: 'all',
		name: 'Vše',
	},
	{
		key: 'denied',
		name: 'Zamítnuto',
	},
	{
		key: 'confirmed',
		name: 'Schváleno',
	},
]

const getSelect = (items, selected, name, onChange, defaultEmpty = false) => {
    const options = items.map((item) => {
        return <option value={item.key} key={item.key}>{item.name}</option>;
    });

    if (defaultEmpty) {
        options.unshift(<option value="null" key="null"></option>);
    }

    return (<select onChange={onChange} name={name} value={selected}>{options}</select>);
}

class ChangeReviewsTable extends React.PureComponent {

	static propTypes = {
		cases: PropTypes.array,
		showCase: PropTypes.func,
		onChangedFilter: PropTypes.func,
		filterVisited: PropTypes.string,
		filterConfirmed: PropTypes.string,
	};

	constructor(props){
		super(props);

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const title = target.type.includes('select') ? event.target.options[event.target.selectedIndex].text : null;
        const name = target.name;

		
		this.props.onChangedFilter({
			name: name, 
			value: value,
			title: title,
		  });
	}

	render() {
		const VisitedSelect = getSelect(VISITED_VALUES, this.props.filterVisited, 'filterVisited', this.handleInputChange);
		const ConfirmedSelect = getSelect(CONFIRMED_VALUES, this.props.filterConfirmed, 'filterConfirmed', this.handleInputChange);
		return (
			<div className="ptr-table change-reviews-table">
				<div className="ptr-table-header">
					<div className="ptr-table-header-item">
						<label>
                            <span>Prohlédnuto</span>
                            {VisitedSelect}
                        </label>
					</div>
					<div className="ptr-table-header-item">
						<label>
                            <span>Schváleno</span>
                            {ConfirmedSelect}
                        </label>
					</div>
					<div className="ptr-table-header-item">Název řízení</div>
					<div className="ptr-table-header-item buttons"></div>
				</div>
				<div className="ptr-table-body">
					{this.props.cases.map(reviewCase => {
						return this.renderRow(reviewCase);
					})}
				</div>
			</div>
		);
	}

	renderRow(reviewCase){
		return (
			<ChangeReviewsTableRow
				data={reviewCase.data}
				showCase={this.props.showCase}
				caseKey={reviewCase.key}
				key={reviewCase.key}
			/>
		);
	}
}

export default ChangeReviewsTable;