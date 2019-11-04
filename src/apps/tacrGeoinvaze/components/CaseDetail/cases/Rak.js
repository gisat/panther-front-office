import React from "react";
import {Title, TextBlock, InvasivePotential, InvasivePotentialCategory, Resources, Resource, Summary, SummaryItem} from "../components";

const Rak = props => (
	<div>
		<Title name="Rak pruhovaný" latinName="Astacus affinis/Astacus limosus/Cambarus pealei/Orconectes limosus"/>
		<Summary>
			<SummaryItem title="Původní areál" text="Východ Severní Ameriky (od Maine po Virginii)"/>
			<SummaryItem title="Sekundární areál" text="Západní, střední a východní Evropa od severu Španělska po Rumunsko"/>
			<SummaryItem title="Introdukce" text="Vypuštěn záměrně, dále se šíří především samovolně"/>
			<SummaryItem title="Pěstování/Chov" text="Ojediněle se chová v akváriích, jedná se o jedince odchycené v přírodě"/>
		</Summary>
		<TextBlock>
			<p>Dospělý rak dorůstá až 120 mm v délce těla, většinou ale méně. Krunýř je hladký, pouze po stranách hlavy jsou nápadné ostré trny. Má jeden pár postorbitálních lišt. Na svrchní straně zadečkových článků jsou příčné hnědočervené až tmavě červené pruhy či oddělené skvrny. Rostrum (rypec) je poměrně dlouhé. Klepeta jsou drobná s oranžovými hroty oddělenými od zbytku prstů černým proužkem. Spodní strana klepet je světlá. Existuje tmavá forma zbarvení, u které nejsou patrné proužky na zadečkových článcích. Někteří dospělí jedinci mohou být naopak světlí a s výraznými světlemodrými okrsky na těle a končetinách.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jedná se o adaptabilní druh, který je částečně tolerantní i k salinitě vody. Dožívá se 3 až 5 let věku. Osídluje střední a větší toky, případně i nádrže, rychlému proudění vody se ale vyhýbá. Pokud jsou samice z nějakého důvodu izolované od samců, mohou se začít množit partenogeneticky (ráčata se líhnou z neoplozených vajec). V jedné snůšce může být i více než 500 vajec. Jedná se o raka s neobvyklou denní aktivitou. Nejedná se o příliš hrabavý druh, hloubí si jen mělké nory. Stejně jako ostatní raci, je i rak pruhovaný všežravcem. Vzhledem k drobnějším klepetům není tak zdatným lovcem jako druhy s klepety většími. Je přenašečem infekčního račího moru a může se sympatricky vyskytovat na jedné lokalitě s dalšími invazními raky.</p>
		</TextBlock>
		<InvasivePotential>
			<InvasivePotentialCategory name="Rozmnožování pohlavní" score={3}/>
			<InvasivePotentialCategory name="Rozmnožování nepohlavní" score={1}/>
			<InvasivePotentialCategory name="Ekologická nika" score={3}/>
			<InvasivePotentialCategory name="Hustota populací" score={3}/>
			<InvasivePotentialCategory name="Dopad na životní prostředí" score={2}/>
			<InvasivePotentialCategory name="Management metoda" text="odchyt"/>
			<InvasivePotentialCategory name="Management aplikace" text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource
				authors="Kouba, A., Petrusek, A., & Kozák, P."
				year={2014}
				title="Continental-wide distribution of crayfish species in Europe: update and maps"
				publication="Knowledge and Management of Aquatic Ecosystems"
				volume="5"
				pages="413"
			/>
			<Resource
				authors="Kozubíková, E., Viljamaa-Dirks, S., Heinikainen, S., & Petrusek, A."
				year={2011}
				title="Spiny-cheek crayfish Orconectes limosus carry a novel genotype of the crayfish plague pathogen Aphanomyces astaci."
				publication="Journal of Invertebrate Pathology"
				volume="108(3)"
				pages="214-216"
			/>
			<Resource
				authors="Pârvulescu, L., Paloş, C., & Molnar, P."
				year={2009}
				title="First record of the spiny-cheek crayfish Orconectes limosus (Rafinesque, 1817) (Crustacea: Decapoda: Cambaridae) in Romania"
				publication="North-Western Journal of Zoology"
				volume="5(2)"
				pages="424-428"
			/>
			<Resource
				authors="Patoka, J., Kalous, L., & Kopecký, O."
				year={2014}
				title="Risk assessment of the crayfish pet trade based on data from the Czech Republic"
				publication="Biological Invasions"
				volume="16(12)"
				pages="2489-2494"
			/>
		</Resources>
	</div>
);

export default Rak;