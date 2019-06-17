import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../../state/Action';
import Select from '../../../../../../state/Select';
import utils from '../../../../../../utils/utils';

import presentation from "./presentation";

const filter = {application: true};

const mapStateToProps = (state, ownProps) => {
	return {
		showIntro: Select.components.get(state, 'tacrGeoinvaze_CaseSelectContent', 'showIntro'),
		content: Select.components.get(state, 'tacrGeoinvaze_CaseSelectContent', 'content'),
		categories: Select.app.getConfiguration(state, 'categories')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'tacrGeoinvaze_CaseSelect_' + utils.randomString(6);

	return dispatch => {
		return {
			showIntro: () => {
				dispatch(Action.components.set('tacrGeoinvaze_CaseSelectContent', 'showIntro', true))
			},
			hideIntro: () => {
				dispatch(Action.components.set('tacrGeoinvaze_CaseSelectContent', 'showIntro', false))
			},
			changeContent: (key) => {
				dispatch(Action.components.set('tacrGeoinvaze_CaseSelectContent', 'content', key));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);