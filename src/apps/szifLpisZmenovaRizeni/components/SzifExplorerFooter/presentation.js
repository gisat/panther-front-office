import React from 'react';
import PropTypes from 'prop-types';
import Timeline from './Timeline';
import AddMapButton from "../SzifCaseFooter/AddMapButton";
import './style.css';

class SzifCaseFooter extends React.PureComponent {
	static propTypes = {
		addMap: PropTypes.func,
		activeMapKey: PropTypes.string,
		// borderOverlays: PropTypes.object,
		// case: PropTypes.object,
		mapsContainer: PropTypes.object,
		mapsCount: PropTypes.number,
		mapSetKey: PropTypes.string,
		selectedMapOrder: PropTypes.number,
		// userGroups: PropTypes.array,
		// toggleGeometries: PropTypes.func,
	};

	constructor(props) {
		super(props);
	}

	render() {
		const {selectedMapOrder, activeMapKey, addMap, mapsCount} = this.props;
		return (
			<div className={'ptr-dromasLpisChangeReview-footer'}>

				<div className="ptr-dromasLpisChangeReviewHeader-topBar mapTools">
					<div className="ptr-dromasLpisChangeReviewHeader-map-info">
						<div className="ptr-dromasLpisChangeReviewHeader-map-name">
							{activeMapKey ? ("Mapa " + (selectedMapOrder + 1)) : ""}
						</div>
					</div>
					<AddMapButton disabled={mapsCount >= 9} addMap={addMap}/>
				</div>
				<Timeline mapKey={activeMapKey}/>
			</div>
		);
	}
}

export default SzifCaseFooter;
