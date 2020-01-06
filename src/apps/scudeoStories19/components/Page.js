import React from 'react';
import Helmet from "react-helmet";
import Fade from 'react-reveal/Fade';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';
import eo4sd_urban_logo from '../assets/eo4sd_urban_logo.png';

export const Visualization = (props) => {
	return (
		<div className="scudeoStories19-visualization">
			<div className="scudeoStories19-visualization-title">
				{props.title}
				{props.subtitle ? (
					<div className="scudeoStories19-visualization-subtitle" title={props.subtitle}>{props.subtitle}</div>
				) : null}
			</div>
			{props.children}
			{props.legend}
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
			<div>
				<div className="scudeoStories19-footer-logo">
					<a href="http://www.eo4sd-urban.info/" target="_blank"><img src={eo4sd_urban_logo}/></a>
				</div>
				<div>
					<p>Prepared by the <a href="http://www.eo4sd-urban.info/" target="_blank">Earth Observation For Urban Sustainable Development (EO4SD Urban)</a> project supported by European Space Agency. Interactive maps and graphs supported by the <a href="https://urban-tep.eu/" target="_blank">Urban Thematic Exploitation Platform (UTEP)</a></p>
					<p>&copy; <a href="http://gisat.cz/content/en" target="_blank">{"Gisat " + currentYear}</a></p>
				</div>
			</div>
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
						<div className="scudeoStories19-abstract">{props.abstract}</div>
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