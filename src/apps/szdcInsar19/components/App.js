import React from 'react';
import Map from "../../../components/common/maps/Map";
import WorldWindMap from "../../../components/common/maps/WorldWindMap/presentation";

let SzdcInsar19App = props => (
	<div className="szdcInsar19-app">
		<div className="szdcInsar19-header">

		</div>
		<div className="szdcInsar19-content">
			<div className="szdcInsar19-map">
				<Map stateMapKey="szdcInsar19" mapComponent={WorldWindMap}/>
			</div>
			<div className="szdcInsar19-visualization">

			</div>
		</div>

	</div>
);

export default SzdcInsar19App;