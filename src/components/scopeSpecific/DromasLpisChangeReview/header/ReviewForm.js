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

		this.onChange = this.onChange.bind(this);
	}

	onChange(value) {
		this.props.editActiveCase(`evaluation_description`, value);
	}

	render() {
		if (this.props.case) {
			return (
				<div>
					<EditableText
						value={this.props.case.data.evaluation_description}
						disabled={!(this.props.userGroup && this.props.userGroup.toLowerCase().includes("gisat"))}
						onChange={this.onChange}
						onFocus={this.props.onFocusInput}
						onBlur={this.props.onBlurInput}
						inverted
					/>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default ReviewForm;