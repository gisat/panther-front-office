import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import ExpandableContent from "./ExpandableContent";
import ReviewForm from './ReviewForm';
import UISelect from "../../../presentation/atoms/UISelect/UISelect";
import {evaluationConclusions} from "../../../../constants/LpisCaseStatuses";

class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userGroup: PropTypes.string,
		editActiveCase: PropTypes.func,
		activeCaseEdited: PropTypes.object
	};

	render() {

		let conclusionInsert, conclusionSelectInsert;

		if (this.props.userGroup === 'gisatUsers' || this.props.userGroup === 'gisatAdmins') {
			conclusionSelectInsert = (
				<UISelect
					inverted
					options={evaluationConclusions}
					value={this.props.case && this.props.case.data.evaluation_result}
					placeholder="závěr"
				/>
			);
		} else {
			if (this.props.case && this.props.case.data.evaluation_result) {
				let conslusion = _.find(evaluationConclusions, {value: this.props.case.data.evaluation_result});
				if (conslusion) {
					let style = {
						'background': conslusion.color
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
							caseEdited={this.props.activeCaseEdited}
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
