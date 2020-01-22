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

import image from "../../../assets/caseDetails/krab-cinsky.jpg";
const Krab = props => (
	<div>
		<Title name="Krab čínský" nameSynonyms="krab vlnoklepetý" latinName="Eriocheir sinensis" latinNameSynonyms=""/>
		<Summary>
			<OriginalArea text="Asie, povodí Žluté řeky v Číně, Korejský poloostrov a pobřeží Japonského souostroví."/>
			<SecondaryArea text="S lodní dopravou byl zavlečen podél pobřeží Evropy a migruje proti proudu do řek (včetně Labe a Vltavy), případně je dále neúmyslně rozvážen loděmi."/>
			<Introduction text="Lodní dopravou i samovolně"/>
			<Breeding text="Vzácně jsou drženi v akváriích jedinci odchyceni v přírodě"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Christian Fischer"
		/>
		<TextBlock>
			<p>Dospělec dorůstá 8 až 10 cm v průměru krunýře. Po stranách krunýře se nacházejí čtyři výrazné špičaté hroty. Klepeta jsou především u samců pokryta hustými brvami (odtud název „vlnoklepetý“). Kráčivé končetiny jsou přibližně dvakrát delší než průměr krunýře. Samci mají delší klepeta než samice.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jedná se o druh s katadromní migrací, jeho vývojový cyklus je poměrně komplikovaný. Larvy se vyvíjejí v moři a po dvou letech mladí krabi migrují proti proudu do řek. Po dalších dvou letech pohlavně dospívají. Na konci léta hromadně migrují zpět do moře, kde dochází k páření. Brzy na to samci hynou. Samice nakladou vejce a stahují se do hlubší vody, kde přezimují. Na jaře se přesouvají zpět na mělčiny a probíhá líhnutí planktonních larev. Následně hynou i samice a larvy procházejí jednotlivými vývojovými stadii (prezoea, zoea a bentická megalopa). Krab čínský je všežravec, aktivně loví jiné bezobratlé a menší ryby. Dokáže dýchat atmosférický kyslík a mimo vodu vydrží i několik dní. V substrátu si hloubí nory, hrabáním může poškozovat hráze. Dožívá se šesti až sedmi let. Je jedním z přenašečů infekčního onemocnění zvaného račí mor. Především v Asii se jedná o velice oblíbený konzumní druh.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Dittel, A. I., & Epifanio, C. E. (2009). Invasion biology of the Chinese mitten crab <i>Eriochier sinensis</i>: A brief review. Journal of Experimental Marine Biology and Ecology, 374(2), 79-92.</Resource>
			<Resource>Herborg, L. M., Rushton, S. P., Clare, A. S., & Bentley, M. G. (2003). Spread of the Chinese mitten crab (<i>Eriocheir sinensis</i> H. Milne Edwards) in Continental Europe: analysis of a historical data set. In Migrations and Dispersal of Marine Organisms (pp. 21-28). Springer, Dordrecht.</Resource>
			<Resource>Schrimpf, A., Schmidt, T., & Schulz, R. (2014). Invasive Chinese mitten crab (<i>Eriocheir sinensis</i>) transmits crayfish plague pathogen (<i>Aphanomyces astaci</i>). Aquatic Invasions, 9(2).</Resource>
			<Resource>Svoboda, J., Strand, D. A., Vrålstad, T., Grandjean, F., Edsman, L., Kozák, P., ... & Petrusek, A. (2014). The crayfish plague pathogen can infect freshwater‐inhabiting crabs. Freshwater Biology, 59(5), 918-929.</Resource>
			<Resource>Weiperth, A., Gál, B., Kuříková, P., Langrová, I., Kouba, A. & Patoka, J. (2019). Risk assessment of pet-traded decapod crustaceans in Hungary with evidence of <i>Cherax quadricarinatus</i> (von Martens, 1868) in the wild. North-Western Journal of Zoology, 15, e171303.</Resource>
		</Resources>
	</div>
);

export default Krab;