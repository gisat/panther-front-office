import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import PlaceSelect from "./components/PlaceSelect";

const Header = props => (
	<div className="scudeoCities-header">
		<div className="scudeoCities-title"><span>City explorer</span></div>
		<PlaceSelect/>
		<div className="scudeoCities-header-content">
			<Link
				to={'/' + props.match.params.placeKey}
				className={classNames("scudeoCities-header-content-link", {
					active: props.contentKey === 'highlights'
				})}
			>
				<span>Highlights</span>
			</Link>
			<Link
				to={'/' + props.match.params.placeKey + '/explore'}
				className={classNames("scudeoCities-header-content-link", {
					active: props.contentKey === 'explore'
				})}
			>
				<span>Explore</span>
			</Link>
		</div>
	</div>
);

export default Header;