import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import Button from '../../../atoms/Button';
import ExpandRowButton from '../../../atoms/ExpandRowButton';
import Icon from '../../../atoms/Icon';

import LpisCaseStatuses, {order as LpisCaseStatusOrder} from '../../../../../constants/LpisCaseStatuses';

class ChangeReviewsTableRow extends React.PureComponent {

	static propTypes = {
		caseKey: PropTypes.number,
		changes: PropTypes.array,
		data: PropTypes.object,
		status: PropTypes.string,
		updated: PropTypes.string,
		showCase: PropTypes.func,
		userGroup: PropTypes.string
	};

	constructor(props){
		super(props);

		this.state = {
			detailsOpen: false
		};

		this.onDetailsClick = this.onDetailsClick.bind(this);
		this.onShowClick = this.onShowClick.bind(this);
	}

	onShowClick() {
		this.props.showCase(this.props.caseKey);
	}

	onDetailsClick(){
		this.setState({
			detailsOpen: !this.state.detailsOpen
		});
	}

	render(){
		let classes = classNames("ptr-table-row", {
			active: this.state.detailsOpen
		});

		let submitDate = moment(this.props.data.submit_date).format("D. M. YYYY");
		let updated = moment(this.props.updated).format("D. M. YYYY");
		let showMapButton = this.renderShowMapButton();

		return (
			<div className={classes}>
				<div className="ptr-table-row-record">
					{this.renderStatus()}
					<div className="ptr-table-row-item">{this.props.data.case_key}</div>
					<div className="ptr-table-row-item">{submitDate}</div>
					<div className="ptr-table-row-item">{updated}</div>
					<div className="ptr-table-row-item buttons">
						<div className="ptr-table-row-action">
							{showMapButton}
						</div>
						<ExpandRowButton
							invisible
							expanded={this.state.detailsOpen}
							onClick={this.onDetailsClick}
						/>
					</div>
				</div>
				{this.renderDetails()}
			</div>
		);
	}

	renderDetails(){
		let classes = classNames(
			"ptr-table-row-details ptr-change-reviews-table-details", {
				open: this.state.detailsOpen
			}
		);

		return (
			<div className={classes}>
				<div className="ptr-change-reviews-table-details-descriptions">
					<div className="ptr-change-reviews-table-details-section">
						<h3>Ohlášení územní změny</h3>
						<h4>Popis důvodu pro aktualizaci LPIS</h4>
						<p>Uživatel odhlásil minulý rok v březnu část DPB z LPIS z důvodu stavebních prací na poli. Práce nyní již
							dokončeny. DPB bude upravován do současného skutečného stavu. Na ortofoto práce ještě probíhají.</p>
						<h4>Určení místa změny v terénu</h4>
						<p>Česká Třebová, vlevo od Janáčkovy č. p. 35</p>
						<h4>Další informace</h4>
						<p>Testovací komentář</p>
					</div>
					<div className="ptr-change-reviews-table-details-section">
						<h3>Výsledek vyhodnocení družicových dat</h3>
						<h4>Popis výsledků vyhodnocení</h4>
						<p>Na družicových snímcích je v severní části DPB, kde byla vyjetá cesta ze staveniště, stále tato cesta patrná. Zatím nelze s jistotou rozhodnout, zda je DPB v pořádku nebo ne. Bude potřeba se podívat na pozdější snímek se vzrostlou vegetací.</p>
						<h4>Využitá družicová a další referenční data</h4>
						<p>Ortofoto LPIS (2015, 2017), Sentinel-2 (2017 - 2018)</p>
						<h4>Další komentář</h4>
						<p>Testovací komentář</p>
					</div>
				</div>
				<div className="ptr-change-reviews-table-details-changes-info">
					<div className="ptr-change-reviews-table-details-section align-right">
						<h3>Poslední změna</h3>
						<div className="ptr-change-reviews-table-details-user">dromas</div>
						<div className="ptr-change-reviews-table-details-date">20. 12. 2017</div>
					</div>
				</div>
			</div>
		);
	}

	renderStatus(){
		let status = LpisCaseStatuses[this.props.status];
		let caption = null;
		let colour = null;
		let opacity = status.database === 'CLOSED' ? 0 : null;
		if (this.props.userGroup === 'gisatUsers' || this.props.userGroup === 'gisatAdmins') {
			caption = status.gisatName;
			colour = status.gisatColour || status.colour;
		} else {
			caption = status.szifName;
			colour = status.colour;
		}

		return (
			<div className="ptr-table-row-item state">
				<Icon icon="circle" color={colour} opacity={opacity}/>
				{caption}
			</div>
		);
	}

	renderShowMapButton(){
		let status = LpisCaseStatuses[this.props.status];
		let group = this.props.userGroup;

		let renderButton = group && (
			(group === "gisatAdmins" || group === "gisatUsers") || (
				(group === "szifAdmins" || group === "szifUsers") &&
				status &&
				(status.database === "EVALUATION_APPROVED" || status.database === "CLOSED")
			)
		);

		return renderButton ? (
			<Button
				small
				onClick={this.onShowClick}
			>
				Zobrazit
			</Button>
		) : null;
	}
}

export default ChangeReviewsTableRow;