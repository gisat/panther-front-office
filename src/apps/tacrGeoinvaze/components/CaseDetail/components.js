import React from "react";
import classnames from "classnames";

export const Title = props => (
	<div className="tacrGeoinvaze-case-detail-title">
		{props.name} <i>({props.latinName}/<span>{props.alternativeLatinName}</span>)</i>
	</div>
);

export const Summary = props => (
	<div className="tacrGeoinvaze-case-detail-summary">
		{props.children}
	</div>
);

export const SummaryItem = props => (
	<div className="tacrGeoinvaze-case-detail-summary-item">
		<div className="tacrGeoinvaze-case-detail-summary-item-title">{props.title}</div>
		<div className="tacrGeoinvaze-case-detail-summary-item-value">{props.text}</div>
	</div>
);

export const TextBlock = props => (
	<div className="tacrGeoinvaze-case-detail-text">
		{props.children}
	</div>
);

export const InvasivePotential = props => (
	<div className="tacrGeoinvaze-case-detail-ip">
		<div className="tacrGeoinvaze-case-detail-ip-title">Invazivní potenciál</div>
		{props.children}
	</div>
);

export const InvasivePotentialCategory = props => (
	<div className="tacrGeoinvaze-case-detail-ip-category">
		<div className="tacrGeoinvaze-case-detail-ip-category-name">{props.name}</div>
		{props.text ? (
			<InvasivePotentialValue text={props.text}/>
		) : (
			<InvasivePotentialRating score={props.score} total={props.total ? props.total : 3}/>
		)}
	</div>
);

export const InvasivePotentialRating = props => {
	let content = [];
	for (let i = 1; i <= props.total; i++) {
		let classes = classnames({
			full: props.score >= i
		});

		content.push(
			<div className={classes}>
			</div>
		);
	}

	return <div className="tacrGeoinvaze-case-detail-ip-rating">{content}</div>;
};

export const InvasivePotentialValue = props => {
	return <div className="tacrGeoinvaze-case-detail-ip-value">{props.text}</div>;
};