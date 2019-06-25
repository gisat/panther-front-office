import React from 'react';
import { Route, Switch } from 'react-router';
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
	
	const processNode = (level, node, ...args) => {
		let {children, label, path, component, ...props} = node.props;
		let className;
		if (typeof node === "object") {
			if (node.type === Directory) {
				// console.log('Directory', label, path, component, props);
				return (
					<div className={"ptr-docs-nav-directory level" + level}>
						<NavLink to={path}>{label}</NavLink>
						{React.Children.map(children, processNode.bind(this, level + 1))}
					</div>
				);
			}
			else if (node.type === Page) {
				// console.log('Page', label, path, component, props);
				return (
					<div className={"ptr-docs-nav-page level" + level}>
						<NavLink to={path}>{label}</NavLink>
						{React.Children.map(children, processNode.bind(this, level + 1))}
					</div>
				);
			}
			else if (node.type === Anchor) {
				// console.log('Anchor', label, path, props);
				return (
					<div className={"ptr-docs-nav-anchor level" + level}>
						<NavLink to={path}>{label}</NavLink>
					</div>
				);
			}
		}
	};
	
	const tree = React.Children.map(children, processNode.bind(this, 1));
	
	return (
		<div className="ptr-docs">
			<div className="ptr-docs-nav">
				{tree}
			</div>
			<div className="ptr-docs-content">
				<Switch>
					{children}
				</Switch>
			</div>
		</div>
	);
	
};

export default Docs;