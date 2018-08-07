import React from 'react';
import PropTypes from 'prop-types';
import ExpandableContent from "./ExpandableContent";
import EditableText from "../../../presentation/atoms/EditableText";

class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userGroup: PropTypes.string,
		editActiveCase: PropTypes.func,
		activeCaseEdited: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar">
					{this.renderStatus(this.props.case)}
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					<ExpandableContent>
						{this.renderEvaluation(this.props.activeCaseEdited || this.props.case)}
					</ExpandableContent>
				</div>
			</div>
		);
	}

	renderStatus(changeReviewCase) {
		if(changeReviewCase) {
			return (
				<div>
					{changeReviewCase.status}
				</div>
			)
		}
	}

	onChange(value) {
		this.props.editActiveCase(`evaluation_description`, value);
	}

	renderEvaluation(changeReviewCase) {
		if(changeReviewCase) {
			return (
				<div>
					<EditableText
						value={changeReviewCase.data.evaluation_description}
						disabled={!(this.props.userGroup && this.props.userGroup.toLowerCase().includes('gisat'))}
						onChange={this.onChange}
					/>
				</div>
			)
		}
	}

}

export default DromasLpisChangeReviewHeader;
