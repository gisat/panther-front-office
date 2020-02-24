import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';

import './style.scss';
import {Button} from '@gisatcz/ptr-atoms';
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
		const classes = classnames("szifLpisZmenovaRizeni-table-row", {
			open: this.state.expanded
		});
		const submitDate = moment(props.data.submitDate).format("DD. MM. YYYY");

		return (
			<div className={classes} key={props.data.caseKey}>
				<div className="szifLpisZmenovaRizeni-table-row-record">
					<div className="szifLpisZmenovaRizeni-table-row-item">Status</div>
					<div className="szifLpisZmenovaRizeni-table-row-item">{props.data.caseKey}</div>
					<div className="szifLpisZmenovaRizeni-table-row-item">{submitDate}</div>
					<div className="szifLpisZmenovaRizeni-table-row-item">{submitDate}</div>
					<div className="szifLpisZmenovaRizeni-table-row-item">{submitDate}</div>
					<div className="szifLpisZmenovaRizeni-table-row-item buttons">{this.renderButtons()}</div>
				</div>
				{this.renderDetails()}
			</div>
		);
	}

	renderButtons() {
		let expandButtonClasses = classnames("szifLpisZmenovaRizeni-table-row-expand", {
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
		const props = this.props;

		let classes = classnames("szifLpisZmenovaRizeni-table-detail", {
			open: this.state.expanded
		});

		return (
			<div className={classes}>
				<SzifCaseTableRowDetail
					caseKey={props.data.caseKey}
					codeDpb={props.data.codeDpb}
					codeJi={props.data.codeJi}
					changeDescription={props.data.changeDescription}
					changeDescriptionOther={props.data.changeDescriptionOther}
					changeDescriptionPlace={props.data.changeDescriptionPlace}
					evaluationResult={props.data.evaluationResult}
					evaluationDescription={props.data.evaluationDescription}
					evaluationDescriptionOther={props.data.evaluationDescriptionOther}
					evaluationUsedSources={props.data.evaluationUsedSources}
				/>
			</div>
		);
	}
}

export default SzifCaseTableRow;
