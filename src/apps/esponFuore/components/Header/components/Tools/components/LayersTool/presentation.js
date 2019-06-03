import React from 'react';

import LayersTree from "../../../../../../../../components/common/maps/LayersTree";
import BackgroundLayers from "./BackgroundLayers.js";

export default class LayerTreesConfig extends React.PureComponent {

    render() {
        const layersFilter = {
            applicationKey: 'esponFuore'
        };

        return (
            <div>
                <LayersTree
                    componentKey="LayersTree_demo"
                    layerTreesFilter={layersFilter}
                >
                    <BackgroundLayers type="checkbox"/>
                </LayersTree>
            </div>
        )
    }
}