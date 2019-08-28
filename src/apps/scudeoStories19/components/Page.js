import React from 'react';
import Helmet from "react-helmet";
import Fade from 'react-reveal/Fade';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';

export const Visualization = (props) => {
	return (
		<div className="scudeoStories19-visualization">
			<div className="scudeoStories19-visualization-title">
				{props.title}
			</div>
			{props.children}
			<div className="scudeoStories19-visualization-description">
				{props.description}
			</div>
		</div>
	);
};

export const Footer = (props) => {
	const currentYear = new Date().getFullYear();

	return (
		<div className="scudeoStories19-footer">
			<div><p>Morbi id ullamcorper urna, eget accumsan ligula. Cras neque lectus, bibendum non turpis eget, pulvinar eleifend ligula. Sed ornare scelerisque odio sit amet cursus. Fusce convallis, sem sed tincidunt pellentesque, magna lorem consectetur lacus.</p></div>
			<div>&copy; <a href="http://gisat.cz/content/en" target="_blank">{"Gisat " + currentYear}</a></div>
		</div>
	);
};

export const Header = (props) => {
	return (
		<div className="scudeoStories19-header-wrapper">
			<div className="scudeoStories19-header-background">
			</div>
			<div className="scudeoStories19-header">
				{props.navigation}
				<Fade cascade duration={1500}>
					<div className="scudeoStories19-header-content">
						<div className="scudeoStories19-title">{props.title}</div>
						<div className="scudeoStories19-intro">{props.intro}</div>
					</div>
				</Fade>
			</div>
		</div>
	);
};

export const Navigation = (props) => {
	return (
		<div className="scudeoStories19-navigation">
			{props.allPages.map(link => <NavLink
				key={link.key}
				className={link.key === props.pageKey ? 'active' : null}
				to={"/" + link.key}
			>{link.navigationName}</NavLink>)}
		</div>
	);
};

export default (props) => {
	const {component, allPages, ...restProps} = props;

	return (
		<div className={"scudeoStories19-page " + props.pageKey} id={props.pageKey}>
			<Helmet><title>{props.pageTitle}</title></Helmet>
			{React.createElement(component, {...restProps, navigation: (<Navigation allPages={allPages} {...restProps}/>)})}
			<Footer/>
		</div>
	);
}