import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Intro.css';

class Intro extends React.PureComponent {

	static propTypes = {
		plainContent: PropTypes.bool,
		logo: PropTypes.object,
		title: PropTypes.string,
		text: PropTypes.string,
		sections: PropTypes.array
	};

	constructor(props){
		super(props);
	}

	render() {
		let classes = classNames('intro-screen', {

		});

		// todo render different types of intro content. Maybe even instead of title?
		let content = this.props.plainContent ? this.renderContent() : null;

		return (
			<div className={classes}>
				<div className="intro-screen-header">
					<h1 className="intro-screen-title">{this.props.title}</h1>
				</div>
				{content}
			</div>
		);
	}

	renderContent(){
		return (
			<div className="intro-screen-content">
				{this.props.logo ? this.renderLogo() : null}
				<div className="intro-screen-content-text" dangerouslySetInnerHTML={{__html: this.props.text}}/>
				{this.props.sections ? this.props.sections.map( (section) => {return this.renderSection(section)}) : null}
			</div>);
	}

	renderLogo(){
		return (
			<div className="intro-screen-logo">
				<img alt="Project logo" src={"img/" + this.props.logo.source}/>
			</div>
		);
	}

	renderSection(data){
		return (
			<div className="intro-screen-section">
				{data.title ? (<h4 className="intro-screen-section-title">{data.title}</h4>) : null}
				{data.content ? (
					<div className="intro-screen-section-content" dangerouslySetInnerHTML={{__html: data.content}}/>
				) : null}
			</div>
		);
	}
}

export default Intro;
