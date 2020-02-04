import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import Button from "../../../../components/common/atoms/Button";

class DromasLpisChangeReviewHeader extends React.PureComponent {

	static propTypes = {
		// case: PropTypes.object,
		// userApprovedEvaluation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		// userCreatedCase: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		// userGroups: PropTypes.array,
		// editActiveCase: PropTypes.func,
		// activeCaseEdited: PropTypes.object,
		// saveEvaluation: PropTypes.func,
		// saveAndApproveEvaluation: PropTypes.func,
		// approveEvaluation: PropTypes.func,
		// rejectEvaluation: PropTypes.func,
		// closeEvaluation: PropTypes.func,
		switchScreen: PropTypes.func,
		// nextCaseKey: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.switchScreen = props.switchScreen.bind(this, 'szifCaseTable');
	}
	render() {
		return (
			<div className="szifLpisZmenovaRizeni-sentinel-explorer-header">
				<div id="szifLpisZmenovaRizeni-sentinel-back">
					<div>
						<Button invisible inverted circular icon="back" onClick={this.switchScreen}/>
					</div>
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;
