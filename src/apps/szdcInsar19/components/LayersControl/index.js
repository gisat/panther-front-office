import {connect} from 'react-redux';
import _ from 'lodash';
import Action from "../../state/Action";
import Select from '../../state/Select';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		activeLayerKeys: Select.components.get(state, 'szdcInsar19_CustomLayers', 'active'),
		layerTemplates: Select.layerTemplates.getAllAsObject(state)
	}

};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onMount: () => {
			if (ownProps.layers) {
				let keys = [];
				_.forIn(ownProps.layers, (layer) => {
					keys.push(layer.data.layerTemplateKey);
				});
				dispatch(Action.layerTemplates.useKeys(keys, 'szdcInsar19_CustomLayers'));
			}
		},
		onLayersChange: (keys) => {
			dispatch(Action.components.set('szdcInsar19_CustomLayers', 'active', keys));
			dispatch(Action.specific.szdcInsar19.changeAppView());
		}
	}

};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);