import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';

import './style.scss';
import Button from "../../../../../components/common/atoms/Button";
import SzifCaseTableRowDetail from "../SzifCaseTableRowDetail/presentation";

import LpisCaseStatuses from "../../../constants/LpisCaseStatuses";

class SzifCaseTableRow extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
		highlightedKeys: PropTypes.object,
		switchScreen: PropTypes.func,
		invalidateCase: PropTypes.func,
		caseSubmitDate: PropTypes.string,
		caseSubmit: PropTypes.object,
		caseChange: PropTypes.object,
		caseEnd: PropTypes.object,
		caseStatus: PropTypes.string,
		caseChanges: PropTypes.array,
		caseJiCode: PropTypes.string,
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
		const {caseSubmit, caseSubmitDate,caseChange,caseChanges,caseEnd,data,caseStatus, caseJiCode} = this.props;
		const classes = classnames("szifLpisZmenovaRizeni-table-row", {
			open: this.state.expanded
		});
		const submitDate = caseSubmitDate ? moment(caseSubmitDate).format("DD. MM. YYYY") : '-';
		const changeDate = caseChange ? moment(caseChange.changed).format("DD. MM. YYYY") : '-';
		const endDate = caseEnd ? moment(caseEnd.changed).format("DD. MM. YYYY") : '-';

		return (
			data ? (
			<div className={classes} key={data.caseKey}>
				<div className="szifLpisZmenovaRizeni-table-row-record">
					<div className="szifLpisZmenovaRizeni-table-row-item">{caseStatus}</div>
					{this.renderItem('caseKey', this.props.data.caseKey)}
					<div className="szifLpisZmenovaRizeni-table-row-item">{submitDate}</div>
					<div className="szifLpisZmenovaRizeni-table-row-item">{changeDate}</div>
					<div className="szifLpisZmenovaRizeni-table-row-item">{endDate}</div>
					{this.renderItem('codeJi', caseJiCode)}
					<div className="szifLpisZmenovaRizeni-table-row-item buttons">{this.renderButtons()}</div>
				</div>
				{this.state.expanded ? this.renderDetails() : null}
			</div>) : null
		);
	}

	renderButtons() {
		let expandButtonClasses = classnames("szifLpisZmenovaRizeni-table-row-expand", {
			open: this.state.expanded
		});

		const showButton = <Button ghost onClick={this.onShowMapButtonClick}>Zobrazit</Button>;
		let displayShowButton = false
		const status = this.props.case && this.props.case.status && this.props.case.status.toUpperCase();
		const hasCreatedStatus = status === LpisCaseStatuses.CREATED.database || status === LpisCaseStatuses.EVALUATION_CREATED.database;
		const isGisat = this.props.userGroups && (this.props.userGroups.includes('gisatUsers') || this.props.userGroups.includes('gisatAdmins'));
		
		if ( !hasCreatedStatus || isGisat) {
			displayShowButton = true
		}
		return (
			<>
				{displayShowButton ? showButton : null}
				<Button className={expandButtonClasses} invisible icon="expand-row" onClick={this.onExpandButtonClick}/>
			</>
		);
	}

	renderItem(itemKey, value){
		const highlighted = this.props.highlightedKeys[itemKey];
		if(highlighted) {
			return <div dangerouslySetInnerHTML={{__html: highlighted}} className="szifLpisZmenovaRizeni-table-row-item highlighted"></div>
		} else {
			return <div className="szifLpisZmenovaRizeni-table-row-item">{value}</div>
		}
	}

	renderDetails() {
		const {caseChange, caseSubmit, userGroups} = this.props;
		const props = this.props;

		let classes = classnames("szifLpisZmenovaRizeni-table-detail", {
			open: this.state.expanded
		});

		return (
			<div className={classes}>
				<SzifCaseTableRowDetail
					caseKey={props.metadataKey}
					invalidateCase={props.invalidateCase}
					status={props.data.status}
					codeDpb={props.data.codeDpb}
					changeDescription={props.data.changeDescription}
					highlightedKeys={props.highlightedKeys}
					changeDescriptionOther={props.data.changeDescriptionOther}
					changeDescriptionPlace={props.data.changeDescriptionPlace}
					evaluationResult={props.data.evaluationResult}
					evaluationDescription={props.data.evaluationDescription}
					evaluationDescriptionOther={props.data.evaluationDescriptionOther}
					evaluationUsedSources={props.data.evaluationUsedSources}
					caseSubmit={caseSubmit}
					caseChange={caseChange}
					userGroups={userGroups}
				/>
			</div>
		);
	}
}

export default SzifCaseTableRow;
