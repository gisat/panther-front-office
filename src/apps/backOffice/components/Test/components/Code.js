import React from "react";

const half = (colourFunc, scaleBase, string) => (
	<code>
		{scaleBase.map(v => (
			<>{'$' + string + v*100 + ': ' + colourFunc(v) + ';'}<br/></>
		))}
	</code>
);

export default props => (
	<div className="ptr-test-colour" style={{color: '#999'}}>
		<div className="ptr-light">
			{half(props.light, props.base, props.lightString)}
		</div>
		<div className="ptr-dark">
			{half(props.dark, props.base, props.darkString)}
		</div>
	</div>
);