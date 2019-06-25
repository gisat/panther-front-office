import React from 'react';
import { Route } from 'react-router';
import { NavLink } from 'react-router-dom';

// export const Directory = ({children, path, ...props}) => (
// 	<>
// 		<Route {...props} />
// 		{children} //todo prefix url
// 	</>
// );
export const Directory = ({children, path, ...props}) => null;

// export const Page = props => React.createElement(Route, props);
export const Page = props => null;

export const Anchor = props => null;


const Docs = ({children, ...props}) => {
	
	const processNode = node => {
		console.log(node, node.type, node.props);
	};
	
	const tree = React.Children.map(children, processNode);
	
	return (
		<div className="ptr-docs">
			<div className="ptr-docs-nav">
				{tree}
			</div>
			<div className="ptr-docs-content">
				{children}
			</div>
		</div>
	);
	
};

export default Docs;