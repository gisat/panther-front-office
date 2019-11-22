import React from "react";
import {
	Title,
	TextBlock,
	InvasivePotential,
	Resources,
	Resource,
	Summary,
	SexualReproduction,
	AsexualReproduction,
	EcologicalNiche,
	PopulationDensity,
	EnvironmentImpact,
	ManagementMethod,
	ManagementApplication, OriginalArea, SecondaryArea, Introduction, Breeding, CaseImage
} from "../components";

import image from "../../../assets/caseDetails/rak-pruhovany.png"; //TODO change source

const _template = props => (
	<div>
		<Title name="" latinName=""/>
		<Summary>
			<OriginalArea text=""/>
			<SecondaryArea text=""/>
			<Introduction text=""/>
			<Breeding text=""/>
		</Summary>
		<CaseImage
			source={image}
			copyright=""
		/>
		<TextBlock>
			<p></p>
			<h5>Ekologie a způsob šíření</h5>
			<p></p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={}/>
			<AsexualReproduction score={}/>
			<EcologicalNiche score={}/>
			<PopulationDensity score={}/>
			<EnvironmentImpact score={}/>
			<ManagementMethod text=""/>
			<ManagementApplication text=""/>
		</InvasivePotential>
		<Resources>
			<Resource></Resource>
		</Resources>
	</div>
);

export default _template;