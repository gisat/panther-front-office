import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

import Case from './Case';
import Review from './Review';
import UserActions from './UserActions';
import MapTools from './MapTools';

class DromasLpisChangeReviewHeader extends React.PureComponent {

	static propTypes = {
		activeMap: PropTypes.object,
		addMap: PropTypes.func,
		case: PropTypes.object,
		mapsContainer: PropTypes.object,
		mapsCount: PropTypes.number,
		selectedMapOrder: PropTypes.number,
		userGroup: PropTypes.string,
		editActiveCase: PropTypes.func,
		activeCaseEdited: PropTypes.object,
		toggleGeometries: PropTypes.func
	};

	render() {
		return (
			<div id="dromasLpisChangeReviewHeader">
				<div id="dromasLpisChangeReviewHeader-case">
					<Case
						case={this.props.case}
					/>
				</div>
				<div id="dromasLpisChangeReviewHeader-review">
					<Review
						case={this.props.case}
						userGroup={this.props.userGroup}
						editActiveCase={this.props.editActiveCase}
						activeCaseEdited={this.props.activeCaseEdited}
					/>
				</div>
				<div id="dromasLpisChangeReviewHeader-actions">
					<UserActions
						case={this.props.case}
						userGroup={this.props.userGroup}
					/>
				</div>
				<div id="dromasLpisChangeReviewHeader-tools"><MapTools
					case={this.props.case}
					map={this.props.activeMap}
					addMap={this.props.addMap}
					mapsContainer={this.props.mapsContainer}
					mapsCount={this.props.mapsCount}
					selectedMapOrder={this.props.selectedMapOrder}
					toggleGeometries={this.props.toggleGeometries}
				/></div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;
