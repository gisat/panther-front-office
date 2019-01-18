import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		backgroundLayer: {
			key: "stamen-uuid",
			data: {
				name: "Stamen terrain",
				type: "wmts",
				url: "http://tile.stamen.com/terrain",
				options: {
					attribution: null
				}
			}
		},
		layers: [],
		navigator: null
	}
};

const mapDispatchToProps = (dispatch) => {
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
