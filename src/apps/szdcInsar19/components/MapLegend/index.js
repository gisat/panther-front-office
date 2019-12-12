import { connect } from 'react-redux';
import Select from '../../state/Select';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		layers: Select.specific.szdcInsar19.getLayersForLegendByMapKey(state, 'szdcInsar19')
	}

};

export default connect(mapStateToProps)(presentation);