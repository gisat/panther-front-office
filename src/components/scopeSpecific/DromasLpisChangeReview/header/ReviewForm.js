import React from "react";
import PropTypes from "prop-types";
import EditableText from "../../../presentation/atoms/EditableText";
import LpisCaseStatuses from "../../../../constants/LpisCaseStatuses";

class ReviewForm extends React.PureComponent {

	static propTypes = {
		userGroup: PropTypes.string,
		onFocusInput: PropTypes.any,
		onBlurInput: PropTypes.any,
		caseEdited: PropTypes.object,
		case: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeOther = this.onChangeOther.bind(this);
		this.getValueForProperty = this.getValueForProperty.bind(this);
	}

	onChangeDescription(value) {
		this.props.editActiveCase(`evaluation_description`, value);
	}

	onChangeOther(value) {
		this.props.editActiveCase(`evaluation_description_other`, value);
	}

	getValueForProperty(property) {
		if(this.props.caseEdited && this.props.caseEdited.data.hasOwnProperty(property)) {
			return this.props.caseEdited.data[property];
		} else if(this.props.case && this.props.case.data.hasOwnProperty(property)) {
			return this.props.case.data[property];
		} else {
			return "";
		}
	}

	render() {
		if (this.props.case) {
			if (
				(this.props.case && this.props.case.status === LpisCaseStatuses.CREATED.database)
				&& (this.props.userGroup === 'gisatUsers' || this.props.userGroup === 'gisatAdmins')
			) {
				return (
					<div>
						<EditableText
							value={this.getValueForProperty(`evaluation_description`)}
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
								value={this.getValueForProperty(`evaluation_description_other`)}
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
			} else if (this.props.case.status !== LpisCaseStatuses.EVALUATION_CREATED) {

				let otherInsert;

				if (this.getValueForProperty(`evaluation_description_other`)) {
					otherInsert = (
						<div>
							<div className='ptr-dromasLpisChangeReviewHeader-property'>Další komentář</div>
							<p>{this.getValueForProperty(`evaluation_description_other`)}</p>
						</div>
					);
				}

				return (
					<div>
						<p>{this.getValueForProperty(`evaluation_description`)}</p>
						{otherInsert}
					</div>
				);
			}
		} else {
			return null;
		}
	}
}

export default ReviewForm;