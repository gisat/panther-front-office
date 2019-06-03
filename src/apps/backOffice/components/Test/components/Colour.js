import React from "react";

const half = (colour, no) => (
	<>
		<div className="ptr-test-colour-no">{no}</div>
		<div className="ptr-test-colour-box" style={{background: colour}}/>
		<div className="ptr-test-colour-lines" style={{borderColor: colour}}/>
		<div className="ptr-test-colour-text" style={{color: colour}}>This is an example of text.</div>
	</>
);

export default props => (
	<div className="ptr-test-colour">
		<div className="ptr-light">
			{half(props.light, props.no)}
		</div>
		<div className="ptr-dark">
			{half(props.dark, props.no)}
		</div>
	</div>
);