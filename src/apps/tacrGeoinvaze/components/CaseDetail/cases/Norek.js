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

import image from "../../../assets/caseDetails/norek-americky.jpg";

const Norek = props => (
	<div>
		<Title name="Norek americký" nameSynonyms="" latinName="Neovison vison" latinNameSynonyms="Mustela vison/Lutreola vison"/>
		<Summary>
			<OriginalArea text="Severní Amerika"/>
			<SecondaryArea text="Evropa, Asie"/>
			<Introduction text="Únik z chovů, záměrné vypouštění z kožešinových farem"/>
			<Breeding text="není povolen"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: J. Vogeltanz"
		/>
		<TextBlock>
			<p>Norci jsou příbuzní tchořům, s nimiž mají podobný tvar i velikost těla. Délka těla dosahuje až 55 cm, ocasu 25 cm a hmotnost 1,5 kg. Na rozdíl od tchořů však mají mezi prsty končetin drobné plovací blány. Chodidla jsou osrstěná, prsty mají drobné drápky. Zbarvení srsti je velmi proměnlivé – od okrové až po černou. Pouze na spodním rtu a na bradě jsou individuálně proměnlivé bílé skvrny.  Norek americký bývá pro svou kvalitní kožešinu chován v zajetí na kožešinových farmách. Norek americký sice není uveden v Evropském seznamu nepůvodních invazních druhů, je ale uveden na Seznamu prioritních invazních druhů ČR (tzv. černý seznam). Jeho záměrné šíření je protizákonné a do 31.1.2019 musely být jeho farmové chovy zrušeny. Myslivecká legislativa tento druh řadí mezi zavlečené druhy živočichů v přírodě nežádoucí, které však může lovit pouze myslivecká stráž. </p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Norek americký osidluje především břehy různých vodních toků a nádrží, ale i různá mokřadní stanoviště, odkud proniká do okrajových částí lesních porostů, do agrocenóz i do okolí lidských sídel.  K pohybu mimo vodní prostředí dochází při přesunem mezi povodími nebo při hledání potravy. Norek je potravní oportunista, který mění složení potravy podle nabídky prostředí, početnosti a chování kořisti. Potravu tvoří drobní a menší savci až do velikosti ondatry, ptáci do velikosti bažanta či husy a jejich vejce, plazi, obojživelníci, ryby, měkkýši raci či hmyz. Svou potravní strategií může vážně ohrožovat populace různých živočišných druhů. Žije téměř výhradně samotářsky, rozloha jeho domovského okrsku velmi kolísá (průměrný okrsek dosahuje zhruba 10 km2). Teritoria jedinců se mohou v různé míře překrývat. V podmínkách ČR se norek americký vyskytuje především v polohách 200–600 m n. m., nadmořská výška však není limitujícím faktorem. Ze Šumavy je výskyt je známý i z poloh okolo 800 m n. m, výjimečně i nad 1000 m n. m. </p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={3}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Anděra M., Červený J.: Červený seznam savců České republiky. Příroda,22: 139-149.</Resource>
			<Resource>Anděra M., Červený J. 2009: Velcí savci v České republice. Rozšíření, historie a ochrana. 2. Šelmy (Carnivora). Národní muzeum, Praha,215 pp.</Resource>
			<Resource>Anděra M., Gaisler J., 2019: Savci České republiky: rozšíření, ekologie ochrana. 2. upravené vydání. Academia Praha, 286 str.</Resource>
			<Resource><>Čech M., Čech P.,2008: Potrava vydry říční (<i>Lutra lutra</i>) a norka amerického (<i>Neovison vison</i>) na Křešickém potoce. Sborník vlastivědných prací Pardubicka,48: 106-121.</></Resource>
			<Resource>Červený J., Anděra M., Koubek P., Homolka M., Toman A., 2001: Recently expanding mammal species in the Czech Republic: distribution, abundace and legal status. Beiträge zur Jagd- und Wildforschung, 26: 111-125.</Resource>
			<Resource><>Červený J., Daniszová K., Anděra M., Koubek P., 2007: Současné změny rozšíření a početnosti norka amerického (<i>Mustela vison</i>) v České republice. Pp. 162-163. In: Bryja J., Zukal J., Řehák Z. (eds.), Zoologiocké dny Brno, Sborník abstaktů z konference 8.-19. února 2007. Brno, ÚBO AV ČR.</></Resource>
			<Resource><>Fischer D., Pavluvčík P., Sedláček F., Šálek M., 2009: Predation of the alian American mink, <i>Mustela vison</i> on native crayfish in middle size stress in central and western Bohemia. Folia Zoologica,58(1): 45-56.</></Resource>
			<Resource>Mlíkovský J., Stýblo P. (eds.), 2006: Nepůvodní druhy fauny a flóry ČR. ČSOP Praha, 496 pp.</Resource>
			<Resource><>Nováková M., Koubek P., 2006: Potrava norka amerického (<i>Mustela vison</i>) v České republice (Carnivora: Mustelidae). Lynx n.s. (Praha) 37: 173-177.</></Resource>
			<Resource>Padyšáková E., Šálek M., Poledník L., Sedláček F., Albrecht T., 2009: Removal of American mink increases of success of simulated nests in linear habitat. Wildlife Research,36(3): 225-230.</Resource>
			<Resource>Poledníková K., Poledník L., Beran V., 2018: Norek americký – opravdový nepřítel. Živa, 5: 282-284.</Resource>
			<Resource>Šálek M., Poledník L., Beran V., Sedláček F., 2006: The home ranges, movements and aktivity pattern of the American mink in the Czech Republic. Pp. 227-228. In: Bryja J., Nedvěd O., Sedláček F., Zukal J. (eds.), Zoologiocké dny České Budějovice, Sborník abstaktů z konference 9.-10. února 2006. Brno, ÚBO AV ČR 246 pp.</Resource>
		</Resources>
	</div>
);

export default Norek;