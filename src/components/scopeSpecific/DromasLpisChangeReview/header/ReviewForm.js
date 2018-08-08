import React from "react";
import PropTypes from "prop-types";
import EditableText from "../../../presentation/atoms/EditableText";

class ReviewForm extends React.PureComponent {

	static propTypes = {
		userGroup: PropTypes.string,
		onFocusInput: PropTypes.any,
		onBlurInput: PropTypes.any
	};

	constructor(props) {
		super(props);

		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeOther = this.onChangeOther.bind(this);
	}

	onChangeDescription(value) {
		this.props.editActiveCase(`evaluation_description`, value);
	}

	onChangeOther(value) {
		this.props.editActiveCase(`evaluation_description_other`, value);
	}

	render() {
		if (this.props.case) {
			return (
				<div>
					<EditableText
						value={this.props.case.data.evaluation_description}
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
							value={this.props.case.data.evaluation_description_other}
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
		} else {
			return null;
		}
	}
}

export default ReviewForm;