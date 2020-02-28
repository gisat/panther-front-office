import React from 'react';
import { Route, withRouter } from '@gisatcz/ptr-state';
import { NavLink } from '@gisatcz/ptr-state';
import pathUtils from 'path';
import classNames from 'classnames';

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


const Docs = ({component, location, children, ...props}) => {
	
	const processNode = (level, currentPath, parentPath, node, ...args) => {
		let {children, label, path, colour, className, ...props} = node.props;
		if (typeof node === "object") {
			let specificClass = "ptr-docs-node-" + path;
			let current, includesCurrent;
			if (node.type === Directory) {
				path = pathUtils.join(parentPath, path);
				if (path === currentPath) {
					current = true;
				} else if (currentPath.startsWith(path)) {
					includesCurrent = true;
				}

				return (
					<div className={classNames("ptr-docs-nav-directory", "level" + level, specificClass, className, {active: current, activeDescendant: includesCurrent})}>
						<span className="ptr-docs-nav-link"><NavLink to={path}>{label}</NavLink></span>
						<div style={colour ? {borderColor: colour} : null}>{React.Children.map(children, processNode.bind(this, level + 1, currentPath, path))}</div>
					</div>
				);
			}
			else if (node.type === Page) {
				path = pathUtils.join(parentPath, path);
				if (path === currentPath) {
					current = true;
				}
				return (
					<div className={classNames("ptr-docs-nav-page", "level" + level, specificClass, className, {active: current})}>
						<span className="ptr-docs-nav-link"><NavLink to={path}>{label}</NavLink></span>
						<div>{ current ? React.Children.map(children, processNode.bind(this, level + 1, currentPath, path)) : null}</div>
					</div>
				);
			}
			else if (node.type === Anchor) {
				path = parentPath + "#" + path;
				return (
					<div className={classNames("ptr-docs-nav-anchor", "level" + level, specificClass, className)}>
						<span className="ptr-docs-nav-link"><NavLink to={path}>{label}</NavLink></span>
					</div>
				);
			}
		}
	};
	
	const tree = React.Children.map(children, processNode.bind(this, 1, location.pathname, "/"));

	children = passParentPath(children, "/");
	
	return (
		<div className="ptr-docs ptr-light">
			<div className="ptr-docs-nav">
				<div className="ptr-docs-nav-header">
					<span className="ptr-docs-nav-header-title"><NavLink to="/">Panther docs</NavLink></span>
				</div>
				<div className="ptr-docs-nav-tree">
					{tree}
				</div>
			</div>
			<div className="ptr-docs-content">
				<Route exact path="/" component={component} />
				{children}
			</div>
		</div>
	);
	
};

export default withRouter(Docs);