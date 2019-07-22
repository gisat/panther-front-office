import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		activePlace: Select.places.getActive(state),
		// contentKey: Select.components.get(state, 'scudeoCities_App', 'contentKey'),
		contentKey: 'highlights',
	}
};

export default connect(mapStateToProps)(presentation);