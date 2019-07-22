import React from 'react';
import PlaceSelect from "./components/PlaceSelect";

const Header = props => (
	<div className="scudeoCities-header">
		<div className="scudeoCities-title"><span>City explorer</span></div>
		<PlaceSelect/>
	</div>
);

export default Header;