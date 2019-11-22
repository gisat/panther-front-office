import React from "react";
import classnames from "classnames";

export const Title = props => (
	<div className="tacrGeoinvaze-case-detail-title">
		{props.name} <br/><i>{props.latinName}</i>
	</div>
);

export const CaseImage = props => (
	<div className="tacrGeoinvaze-case-detail-image">
		<img alt="case-image" src={props.source}/>
		<div className="tacrGeoinvaze-case-image-copyright">{props.copyright}</div>
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

export const OriginalArea = props => (
	<SummaryItem title="Původní areál" text={props.text}/>
);

export const SecondaryArea = props => (
	<SummaryItem title="Sekundární areál" text={props.text}/>
);

export const Introduction = props => (
	<SummaryItem title="Introdukce" text={props.text}/>
);

export const Breeding = props => (
	<SummaryItem title="Pěstování/chov" text={props.text}/>
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

export const SexualReproduction = props => (
	<InvasivePotentialCategoryWithRating name="Rozmnožování pohlavní" score={props.score}/>
);

export const AsexualReproduction = props => (
	<InvasivePotentialCategoryWithRating name="Rozmnožování nepohlavní" score={props.score}/>
);

export const EcologicalNiche = props => (
	<InvasivePotentialCategoryWithRating name="Ekologická nika" score={props.score}/>
);

export const PopulationDensity = props => (
	<InvasivePotentialCategoryWithRating name="Hustota populací" score={props.score}/>
);

export const EnvironmentImpact = props => (
	<InvasivePotentialCategoryWithRating name="Dopad na životní prostředí" score={props.score}/>
);

export const ManagementMethod = props => (
	<InvasivePotentialCategoryWithValue name="Management metoda" text={props.text}/>
);

export const ManagementApplication = props => (
	<InvasivePotentialCategoryWithValue name="Management aplikace" text={props.text}/>
);

export const InvasivePotentialCategoryWithRating = props => (
	<div className="tacrGeoinvaze-case-detail-ip-category">
		<div className="tacrGeoinvaze-case-detail-ip-category-name">{props.name}</div>
		<InvasivePotentialRating score={props.score} total={props.total ? props.total : 3}/>
	</div>
);

export const InvasivePotentialCategoryWithValue = props => (
	<div className="tacrGeoinvaze-case-detail-ip-category">
		<div className="tacrGeoinvaze-case-detail-ip-category-name">{props.name}</div>
		<InvasivePotentialValue text={props.text}/>
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

export const Resources = props => (
	<div className="tacrGeoinvaze-case-detail-resources">
		<div className="tacrGeoinvaze-case-detail-resources-title">Zdroje</div>
		{props.children}
	</div>
);

export const Resource = props => {
	return (
		<div className="tacrGeoinvaze-case-detail-resource">
			{props.children}
		</div>
	)
};