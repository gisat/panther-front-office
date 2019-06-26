import React from 'react';
import { Route } from 'react-router';
import { NavLink } from 'react-router-dom';
import pathUtils from 'path';

const passParentPath = (children, path) => React.Children.map(children, child => React.cloneElement(child, {parentPath: path, ...child.props}));

export const Directory = ({children, path, parentPath, component, ...props}) => {
	path = pathUtils.join(parentPath, path);
	children = passParentPath(children, path);
	return (
		<>
			<Route exact path={path} component={component} />
			{children}
		</>
	);
};

export const Page = ({children, path, parentPath, component, ...props}) => {
	path = pathUtils.join(parentPath, path);
	return (
		<Route exact path={path} component={component} />
	);
};

export const Anchor = props => null;


const Docs = ({path, children, ...props}) => {
	
	const processNode = (level, parentPath, node, ...args) => {
		let {children, label, path, component, ...props} = node.props;
		if (typeof node === "object") {
			if (node.type === Directory) {
				path = pathUtils.join(parentPath, path);
				return (
					<div className={"ptr-docs-nav-directory level" + level}>
						<span className="ptr-docs-nav-link"><NavLink to={path}>{label}</NavLink></span>
						{React.Children.map(children, processNode.bind(this, level + 1, path))}
					</div>
				);
			}
			else if (node.type === Page) {
				path = pathUtils.join(parentPath, path);
				//todo only display anchors for active page
				return (
					<div className={"ptr-docs-nav-page level" + level}>
						<span className="ptr-docs-nav-link"><NavLink to={path}>{label}</NavLink></span>
						{React.Children.map(children, processNode.bind(this, level + 1, path))}
					</div>
				);
			}
			else if (node.type === Anchor) {
				path = parentPath + "#" + path;
				return (
					<div className={"ptr-docs-nav-anchor level" + level}>
						<span className="ptr-docs-nav-link"><NavLink to={path}>{label}</NavLink></span>
					</div>
				);
			}
		}
	};
	
	const tree = React.Children.map(children, processNode.bind(this, 1, path));

	children = passParentPath(children, path);
	
	return (
		<div className="ptr-docs ptr-light">
			<div className="ptr-docs-nav">
				<div className="ptr-docs-nav-header">
					Panther docs
				</div>
				<div className="ptr-docs-nav-tree">
					{tree}
				</div>
			</div>
			<div className="ptr-docs-content">
				{children}
			</div>
		</div>
	);
	
};

export default Docs;