import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import ExpandableContent from "./ExpandableContent";
import ReviewForm from './ReviewForm';
import UISelect from "../../../presentation/atoms/UISelect/UISelect";
import {evaluationConclusions} from "../../../../constants/LpisCaseStatuses";
import LpisCaseStatuses from "../../../../constants/LpisCaseStatuses";

class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userGroup: PropTypes.string,
		editActiveCase: PropTypes.func,
		activeCaseEdited: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.onChangeResult = this.onChangeResult.bind(this);
	}

	onChangeResult(value) {
		this.props.editActiveCase(`evaluation_result`, value.value);
	}

	render() {

		let conclusionInsert, conclusionSelectInsert;

		if (
			(this.props.case && this.props.case.status === LpisCaseStatuses.CREATED.database)
			&& (this.props.userGroup === 'gisatUsers' || this.props.userGroup === 'gisatAdmins')
		) {
			conclusionSelectInsert = (
				<UISelect
					clearable={false}
					inverted
					options={evaluationConclusions}
					value={this.props.caseEdited && this.props.caseEdited.data.evaluation_result || this.props.case && this.props.case.data.evaluation_result}
					placeholder="závěr"
					onChange={this.onChangeResult}
				/>
			);
		} else {
			if (this.props.case && this.props.case.data.evaluation_result) {
				let conslusion = _.find(evaluationConclusions, {value: this.props.case.data.evaluation_result});
				if (conslusion) {
					let style = {
						'background': conslusion.colour
					};
					conclusionInsert = (
						<span className='ptr-dromasLpisChangeReviewHeader-status' style={style}>{conslusion.label}</span>
					);
				}
			}
		}

		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar review">
					<div>
						<span className='ptr-dromasLpisChangeReviewHeader-heading'>Vyhodnocení</span>
						{conclusionInsert}
					</div>
					<div>
						{conclusionSelectInsert}
					</div>
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					<ExpandableContent>
						<ReviewForm
							case={this.props.case}
							caseEdited={this.props.caseEdited}
							editActiveCase={this.props.editActiveCase}
							userGroup={this.props.userGroup}
						/>
					</ExpandableContent>
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;
