import React from 'react';
import CaseSelect from "./components/CaseSelect";

const Header = props => (
	<div className="tacrGeoinvaze-header">
		<div className="tacrGeoinvaze-title">Geoinformační portál biologických invazí</div>
		<CaseSelect/>
		<div className="tacrGeoinvaze-header-space">
			<div>Geoinformation portal for invasive species</div>
			Development preview
		</div>
	</div>
);

export default Header;