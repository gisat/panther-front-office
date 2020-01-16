import React from 'react';
import User from "../../../components/common/controls/User";
import ScreenAnimator from "../../../components/common/ScreenAnimator/presentation";
import SzifCaseTable from "./SzifCaseTable";
import SzifCaseForm from "./SzifCaseForm";

export default props => (
	<div className="szifLpisZmenovaRizeni-case-list">
		<div className="szifLpisZmenovaRizeni-user">
			<User inverted/>
		</div>
		<ScreenAnimator
			activeScreenKey='szifCaseTable'
		>
			<SzifCaseTable screenKey="szifCaseTable" />
			<SzifCaseForm screenKey="szifCaseForm"/>
		</ScreenAnimator>
	</div>
);