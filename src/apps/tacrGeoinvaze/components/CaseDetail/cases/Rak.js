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
import image from "../../../assets/caseDetails/rak-pruhovany.png";

const Rak = props => (
	<div>
		<Title name="Rak pruhovaný" latinName="Astacus affinis/Astacus limosus/Cambarus pealei/Orconectes limosus"/>
		<Summary>
			<OriginalArea text="Východ Severní Ameriky (od Maine po Virginii)"/>
			<SecondaryArea text="Západní, střední a východní Evropa od severu Španělska po Rumunsko"/>
			<Introduction text="Vypuštěn záměrně, dále se šíří především samovolně"/>
			<Breeding text="Ojediněle se chová v akváriích, jedná se o jedince odchycené v přírodě"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: biolob.cz"
		/>
		<TextBlock>
			<p>Dospělý rak dorůstá až 120 mm v délce těla, většinou ale méně. Krunýř je hladký, pouze po stranách hlavy jsou nápadné ostré trny. Má jeden pár postorbitálních lišt. Na svrchní straně zadečkových článků jsou příčné hnědočervené až tmavě červené pruhy či oddělené skvrny. Rostrum (rypec) je poměrně dlouhé. Klepeta jsou drobná s oranžovými hroty oddělenými od zbytku prstů černým proužkem. Spodní strana klepet je světlá. Existuje tmavá forma zbarvení, u které nejsou patrné proužky na zadečkových článcích. Někteří dospělí jedinci mohou být naopak světlí a s výraznými světlemodrými okrsky na těle a končetinách.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jedná se o adaptabilní druh, který je částečně tolerantní i k salinitě vody. Dožívá se 3 až 5 let věku. Osídluje střední a větší toky, případně i nádrže, rychlému proudění vody se ale vyhýbá. Pokud jsou samice z nějakého důvodu izolované od samců, mohou se začít množit partenogeneticky (ráčata se líhnou z neoplozených vajec). V jedné snůšce může být i více než 500 vajec. Jedná se o raka s neobvyklou denní aktivitou. Nejedná se o příliš hrabavý druh, hloubí si jen mělké nory. Stejně jako ostatní raci, je i rak pruhovaný všežravcem. Vzhledem k drobnějším klepetům není tak zdatným lovcem jako druhy s klepety většími. Je přenašečem infekčního račího moru a může se sympatricky vyskytovat na jedné lokalitě s dalšími invazními raky.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={1}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Kouba, A., Petrusek, A., & Kozák, P. (2014). Continental-wide distribution of crayfish species in Europe: update and maps. Knowledge and Management of Aquatic Ecosystems, 413, 05.</Resource>
			<Resource><>Kozubíková, E., Viljamaa-Dirks, S., Heinikainen, S., & Petrusek, A. (2011). Spiny-cheek crayfish <i>Orconectes limosus</i> carry a novel genotype of the crayfish plague pathogen <i>Aphanomyces astaci</i>. Journal of Invertebrate Pathology, 108(3), 214-216.</></Resource>
			<Resource><>Pârvulescu, L., Paloş, C., & Molnar, P. (2009). First record of the spiny-cheek crayfish <i>Orconectes limosus</i> (Rafinesque, 1817) (Crustacea: Decapoda: Cambaridae) in Romania. North-Western Journal of Zoology, 5(2), 424-428</></Resource>
			<Resource>Patoka, J., Kalous, L., & Kopecký, O. (2014). Risk assessment of the crayfish pet trade based on data from the Czech Republic. Biological Invasions, 16(12), 2489-2494.</Resource>
		</Resources>
	</div>
);

export default Rak;