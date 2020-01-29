import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';

import './style.scss';
import Button from "../../../../../components/common/atoms/Button";
import SzifCaseTableRowDetail from "../SzifCaseTableRowDetail/presentation";

class SzifCaseTableRow extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
		highlightedCaseKey: PropTypes.string,
		highlightedChangeDescription: PropTypes.string,
		switchScreen: PropTypes.func,
		caseSubmit: PropTypes.object,
		caseChange: PropTypes.object,
		caseEnd: PropTypes.object,
		caseStatus: PropTypes.string,
		caseChanges: PropTypes.array,
	};

	constructor(props) {
		super(props);

		this.state = {
			expanded: !!props.expanded
		};

		this.onExpandButtonClick = this.onExpandButtonClick.bind(this);
		this.onShowMapButtonClick = this.onShowMapButtonClick.bind(this);
	}

	onExpandButtonClick() {
		this.setState({
			expanded: !this.state.expanded
		})
	}

	onShowMapButtonClick() {
		this.props.switchScreen();
		this.props.showMap();
	}

	render() {
		const {caseSubmit,caseChange,caseChanges,caseEnd,data,caseStatus} = this.props;
		const classes = classnames("szifLpisZmenovaRizeni-table-row", {
			open: this.state.expanded
		});
		const submitDate = caseSubmit ? moment(caseSubmit.changed).format("DD. MM. YYYY") : '-';
		const changeDate = caseChange ? moment(caseChange.changed).format("DD. MM. YYYY") : '-';
		const endDate = caseEnd ? moment(caseEnd.changed).format("DD. MM. YYYY") : '-';

		return (
			<div className={classes} key={data.caseKey}>
				<div className="szifLpisZmenovaRizeni-table-row-record">
					<div className="szifLpisZmenovaRizeni-table-row-item">{caseStatus}</div>
					{this.renderCaseKey()}
					<div className="szifLpisZmenovaRizeni-table-row-item">{submitDate}</div>
					<div className="szifLpisZmenovaRizeni-table-row-item">{changeDate}</div>
					<div className="szifLpisZmenovaRizeni-table-row-item">{endDate}</div>
					<div className="szifLpisZmenovaRizeni-table-row-item buttons">{this.renderButtons()}</div>
				</div>
				{this.state.expanded ? this.renderDetails() : null}
			</div>
		);
	}

	renderButtons() {
		let expandButtonClasses = classnames("szifLpisZmenovaRizeni-table-row-expand", {
			open: this.state.expanded
		});

		return (
			<>
				<Button ghost onClick={this.onShowMapButtonClick}>Zobrazit</Button>
				<Button className={expandButtonClasses} invisible icon="expand-row" onClick={this.onExpandButtonClick}/>
			</>
		);
	}

	renderCaseKey(){
		return this.props.highlightedCaseKey ? (
			<div dangerouslySetInnerHTML={{__html: this.props.highlightedCaseKey}} className="szifLpisZmenovaRizeni-table-row-item highlighted"></div>
		) : (
			<div className="szifLpisZmenovaRizeni-table-row-item">{this.props.data.caseKey}</div>
		);
	}

	renderDetails() {
		const {caseChange, caseSubmit} = this.props;
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
					highlightedChangeDescription={props.highlightedChangeDescription}
					changeDescriptionOther={props.data.changeDescriptionOther}
					changeDescriptionPlace={props.data.changeDescriptionPlace}
					evaluationResult={props.data.evaluationResult}
					evaluationDescription={props.data.evaluationDescription}
					evaluationDescriptionOther={props.data.evaluationDescriptionOther}
					evaluationUsedSources={props.data.evaluationUsedSources}
					caseSubmit={caseSubmit}
					caseChange={caseChange}
				/>
			</div>
		);
	}
}

export default SzifCaseTableRow;
