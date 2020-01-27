import React from "react";
import PropTypes from "prop-types";
import EditableText from "../../../../components/common/atoms/EditableText";
import LpisCaseStatuses from "../../../../constants/LpisCaseStatuses";
import utils from '../../../../utils/utils';

class ReviewForm extends React.PureComponent {

	static propTypes = {
		userApprovedEvaluation: PropTypes.object,
		userGroup: PropTypes.string,
		onFocusInput: PropTypes.any,
		onBlurInput: PropTypes.any,
		caseEdited: PropTypes.object,
		case: PropTypes.object,
		editActiveCase: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeOther = this.onChangeOther.bind(this);
	}

	onChangeDescription(value) {
		this.props.editActiveCase(this.props.case.key, `evaluationDescription`, value);
	}

	onChangeOther(value) {
		this.props.editActiveCase(this.props.case.key, `evaluationDescriptionOther`, value);
	}

	render() {
		
		if (this.props.case) {
			let data = {...this.props.case.data};
			if (this.props.caseEdited) {
				data = {...data, ...this.props.caseEdited}
			}

			if (
				(data.status && data.status.toUpperCase() === LpisCaseStatuses.CREATED.database)
				&& (this.props.userGroup === 'gisatUsers' || this.props.userGroup === 'gisatAdmins')
			) {
				return (
					<div>
						<EditableText
							value={data['evaluationDescription']}
							disabled={!(this.props.userGroup && this.props.userGroup.toLowerCase().includes("gisat"))}
							editing={(this.props.userGroup && this.props.userGroup.toLowerCase().includes("gisat"))}
							onChange={this.onChangeDescription}
							onFocus={this.props.onFocusInput}
							onBlur={this.props.onBlurInput}
							inverted
						/>
						<label>
							<span>Další komentář</span>
							<EditableText
								value={data[`evaluationDescriptionOther`]}
								disabled={!(this.props.userGroup && this.props.userGroup.toLowerCase().includes("gisat"))}
								editing={(this.props.userGroup && this.props.userGroup.toLowerCase().includes("gisat"))}
								onChange={this.onChangeOther}
								onFocus={this.props.onFocusInput}
								onBlur={this.props.onBlurInput}
								inverted
							/>
						</label>
					</div>
				);
			} else if (data.status && data.status.toUpperCase() !== LpisCaseStatuses.EVALUATION_CREATED) {

				let otherInsert, userInsert;

				if (data[`evaluationDescriptionOther`]) {
					otherInsert = (
						<div>
							<div className='ptr-dromasLpisChangeReviewHeader-property'>Další komentář</div>
							{utils.renderParagraphWithSeparatedLines(data[`evaluationDescriptionOther`])}
						</div>
					);
				}

				if (this.props.userApprovedEvaluation){
					let user = this.props.userApprovedEvaluation;
					userInsert = (
						<div>
							<div className='ptr-dromasLpisChangeReviewHeader-property'>Vyhodnocení schválil</div>
							<p>{user.name} ({user.email})</p>
						</div>
					);
				}

				return (
					<div>
						{utils.renderParagraphWithSeparatedLines(data[`evaluationDescription`])}
						{otherInsert}
						{userInsert}
					</div>
				);
			}
		} else {
			return null;
		}
	}
}

export default ReviewForm;