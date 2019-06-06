import React from 'react';
import CaseSelect from "./components/CaseSelect";

const Header = props => (
	<div className="tacrGeoinvaze-header">
		<div>Geoinformační portál biologických invazí</div>
		<CaseSelect/>
	</div>
);

export default Header;