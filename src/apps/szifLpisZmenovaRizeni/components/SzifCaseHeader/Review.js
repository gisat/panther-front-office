import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import ExpandableContent from "./ExpandableContent";
import ReviewForm from './ReviewForm';
import Select from "../../../../components/common/atoms/Select/Select";
import {evaluationConclusions} from "../../constants/LpisCaseStatuses";
import LpisCaseStatuses from "../../constants/LpisCaseStatuses";
class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userApprovedEvaluation: PropTypes.object,
		userGroup: PropTypes.string,
		editActiveCase: PropTypes.func,
		activeCaseEdited: PropTypes.object,
		caseEdited: PropTypes.object,
	};

	constructor(props) {
		super(props);

		this.onChangeResult = this.onChangeResult.bind(this);
	}

	onChangeResult(value) {
		this.props.editActiveCase(this.props.case.key, `evaluationResult`, value.value);
	}

	render() {
		let conclusionInsert, conclusionSelectInsert;
		let data = {...this.props.case.data};
		if (this.props.caseEdited) {
			data = {...data, ...this.props.caseEdited}
		}

		if (
			(this.props.case && this.props.case.data.status && this.props.case.data.status.toUpperCase() === LpisCaseStatuses.CREATED.database)
			&& (this.props.userGroup === 'gisatUsers' || this.props.userGroup === 'gisatAdmins')
		) {
			conclusionSelectInsert = (
				<Select
					className={"ptr-dromasLpisChangeReview-conclusion"}
					clearable={false}
					// inverted
					options={evaluationConclusions}
					optionLabel = 'label'
					optionValue = 'value'

					value={data.evaluationResult}
					placeholder="závěr"
					onChange={this.onChangeResult}
				/>
			);
		} else {
			if (this.props.case && this.props.case.data.evaluationResult) {
				let conslusion = _.find(evaluationConclusions, {value: this.props.case.data.evaluationResult});
				if (conslusion) {
					let style = {
						'background': conslusion.colour
					};
					conclusionInsert = (
						<span className='ptr-dromasLpisChangeReviewHeader-conclusion-status' style={style}>{conslusion.label}</span>
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
					<div className={'ptr-dromasLpisChangeReviewHeader-conclusion-select'}>
						{conclusionSelectInsert}
					</div>
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					<ExpandableContent>
						<ReviewForm
							case={this.props.case}
							caseEdited={this.props.caseEdited}
							editActiveCase={this.props.editActiveCase}
							userApprovedEvaluation={this.props.userApprovedEvaluation}
							userGroup={this.props.userGroup}
						/>
					</ExpandableContent>
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;
