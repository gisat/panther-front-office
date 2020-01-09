import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';

import './style.scss';
import Button from "../../../../../components/common/atoms/Button";
import SzifCaseTableRowDetail from "../SzifCaseTableRowDetail/presentation";

class SzifCaseTableRow extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.state = {
			expanded: !!props.expanded
		};

		this.onExpandButtonClick = this.onExpandButtonClick.bind(this);
	}

	onExpandButtonClick() {
		this.setState({
			expanded: !this.state.expanded
		})
	}

	render() {
		const props = this.props;
		const classes = classnames("szifLpisZmenovaRizeni-case-table-row", {
			open: this.state.expanded
		});
		const submitDate = moment(props.data.submitDate).format("DD. MM. YYYY");

		return (
			<div className={classes}>
				<div className="szifLpisZmenovaRizeni-case-table-row-record">
					<div className="szifLpisZmenovaRizeni-case-table-row-item">Status</div>
					<div className="szifLpisZmenovaRizeni-case-table-row-item">{props.data.caseKey}</div>
					<div className="szifLpisZmenovaRizeni-case-table-row-item">{submitDate}</div>
					<div className="szifLpisZmenovaRizeni-case-table-row-item">{submitDate}</div>
					<div className="szifLpisZmenovaRizeni-case-table-row-item">{submitDate}</div>
					<div className="szifLpisZmenovaRizeni-case-table-row-item buttons">{this.renderButtons()}</div>
				</div>
				{this.renderDetails()}
			</div>
		);
	}

	renderButtons() {
		let expandButtonClasses = classnames("szifLpisZmenovaRizeni-case-table-row-expand", {
			open: this.state.expanded
		});

		return (
			<>
				<Button onClick={() => {}}>Zobrazit</Button>
				<Button className={expandButtonClasses} invisible icon="expand-row" onClick={this.onExpandButtonClick}/>
			</>
		);
	}

	renderDetails() {
		let classes = classnames("szifLpisZmenovaRizeni-case-table-row-details", {
			open: this.state.expanded
		});

		return (
			<div className={classes}>
				<SzifCaseTableRowDetail/>
			</div>
		);
	}
}

export default SzifCaseTableRow;
