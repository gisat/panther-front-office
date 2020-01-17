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

import image from "../../../assets/caseDetails/topol-kanadsky.jpg";

const TopolKanadsky = props => (
	<div>
		<Title name="Topol kanadský" nameSynonyms="" latinName="Populus canadensis" latinNameSynonyms="Populus euroamericana/Populus deltoides"/>
		<Summary>
			<OriginalArea text="Hybridní původ"/>
			<SecondaryArea text="Celé Evropa, Severní Amerika"/>
			<Introduction text="Pěstování v lesnictví i jako energetická dřevina"/>
			<Breeding text="Ano"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Martin Vojík"
		/>
		<TextBlock>
			<p>Topol kanadský (Canadian poplar nebo Carolina poplar) je statný strom dorůstající výšky kolem 25–40 m má širokou korunou a hladký kmen, který mívá v průměru okolo 1–2 m. Z počátku má hladkou, později hrubě rozpukanou. Pupeny jsou hnědavé, lepkavé a cca 1–2 cm dlouhé. Listy jsou řapíkaté, řapík je 4–7 cm dlouhý, z boku smáčklý a často načervenalý, čepel je široce trojúhelníkovitě vejčitá, 6–12 cm dlouhá a 4–10 cm široká, u řapíku s 1–2 drobnými žlázkami, na bázi široce klínovitá až uťatá, na okraji se zřetelným chrupavčitým lemem, vroubkovaně pilovitá, jemně brvitá. Jedná se o dvoudomý strom - jehnědy jsou 3–8 cm dlouhé, přičemž samčí jsou červenavé a kratší, samičí mají lysý semeník a 2–4 žlutozelené blizny. Kvete v březnu a dubu před olistěním. Plodem jsou tobolky.  Topol kanadský je velmi proměnlivý. Bylo vyšlechtěno mnoho různých kultivarů, které se obtížně rozlišují a určují. Mezi známé kultivary se řadí cv. Serotina, Robusta, Regenerata, Grandis.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Tento druh vznikl křížením severoamerického topolu bavlníkového (<i>Populus deltoide</i> Marschalls) a evropského topolu černého (<i>Populus nigra</i> L.) asi v roce 1750 ve Francii. Jedná se o světlomilnou a teplomilnou dřevinu, vysazovaná na minerálně bohatých a čerstvě vlhkých půdách, s vyšší hladinou podzemní vody.  V Evropě se jedná o hojně vysazovaný druh. V České republice se nejčastěji objevuje v nižších až středních polohách. Proniká zejména do polopřirozených a přírodních stanovišť do porostů vrbových křovin na hlinitých, štěrkových a písčitých náplavech, do údolních měkkých a tvrdých luhů, pobřežních porostů toků a vysokých mezofi lních křovin. Existuje velké množství obtížněji rozlišitelných kultivarů. Jde o rychle rostoucí, avšak krátkověký druh, jeho porosty je možno těžit již ve 20 až 40 letech. Najdeme ho v lužních lesích, v intravilánech obcí ve stromořadích a větrolamech, podél vodotečí a potoků, u zemědělských podniků a skládek. V mnoha oblastech vytlačil původní topol černý (<i>Populus nigra</i> L.). Jedná se o sporný zdroj pro využitá jako obnovitelného zdroje energie.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={2}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={2}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="není"/>
			<ManagementApplication text="není"/>
		</InvasivePotential>
		<Resources>
			<Resource>HEJNÝ S., SLAVÍK B., HROUDA L. & SKALICKÝ V. (eds), Květena České republiky 2, p. 489–495, Academia, Praha</Resource>
			<Resource>PERGL, J.; PERGLOVÁ, I.; VÍTKOVÁ, M.; POCOVÁ, L.; JANATA, T.; ŠÍMA, J. 2014. SPPK D02 007 LIKVIDACE VYBRANÝCH INVAZNÍCH DRUHŮ ROSTLIN. Standard péče o přírodu a krajinu. Péče o vybrané terestrické ekosystémy. Řada D. AOPK ČR (pracovní verze)</Resource>
			<Resource>MLÍKOVSKÝ J, STÝBLO P. (eds). 2006. Nepůvodní druhy fauny a flóry České republiky. Praha, ČSOP, 495 s.</Resource>
			<Resource><a href="http://www.pladias.cz" target="_blank">www.pladias.cz</a>; 2014-2019</Resource>
		</Resources>
	</div>
);

export default TopolKanadsky;