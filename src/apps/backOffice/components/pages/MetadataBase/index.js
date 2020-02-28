import {connect} from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import {utils} from '@gisatcz/ptr-utils'

import presentation from "./presentation";
import apps from '../../../../../apps';

const mapStateToProps = (state, ownProps) => {
	let props = {specificDataTypes: null};
	let activeApp = Select.specific.apps.getActive(state);

	if (activeApp) {
		let app = _.find(apps, {key: activeApp.key});
		if (app && app.configuration && app.configuration.specificMetadataTypes) {
			props.specificDataTypes = app.configuration.specificMetadataTypes
		}
	}

	return props;
};

export default connect(mapStateToProps)(presentation);