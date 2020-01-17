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

import image from "../../../assets/caseDetails/jasan-pensylvansky.jpg";

const JasanPensylvansky = props => (
	<div>
		<Title name="Jasan pensylvánský" nameSynonyms="" latinName="Fraxinus pennsylvanica" latinNameSynonyms="Calycomelia lanceolata /Calycomelia pennsylvanica/Fraxinus americana var. normale/Fraxinus americana var. pennsylvanica/Fraxinus americana subsp. pennsylvanica/Fraxinus lanceolata"/>
		<Summary>
			<OriginalArea text="Severní Amerika"/>
			<SecondaryArea text="ČR (jižní Morava, Polabí), Belgie, Maďarsko, Argentina, východní Afrika"/>
			<Introduction text="Úmyslně – uniká z okrasných výsadeb"/>
			<Breeding text="Vysazuje se jako parková a městská dřevina; místy může být umístěna také do lesních porostů"/>
		</Summary>
		<CaseImage
			source={image}
			copyright="Foto: Zdroj - wikimedia"
		/>
		<TextBlock>
			<p>Jedná se o dvoudomý strom z čeledi olivovníkovité (<i>Oleaceae</i>), který může být až 22 m vysoký, s kmenem o průměru 50 cm; borka je hnědavá a mělce brázditá. Letorosty jsou většinou pýřité s rezavými pupeny. Listové jizvy jsou úzké a půlměsíčité. Samotné listy jsou 25–30 cm dlouhé, 3–4jařmé, lístky 6–15 cm dlouhé a 2–4 cm široké, ostře pilovité, oboustranně zelené a na rubu pýřité. Během léta jsou listy taxonu o poznání lesklejší než listy domácího jasanu ztepilého (<i>Fraxinus excelsior</i>) a v podzimních měsících se listy zbarvují do jasně žlutavé barvy. Druh kvete až po vyrašení listů a jeho květy jsou jednopohlavné, bezkorunné a vyrůstající z postranních pupenů. Plodem jsou nažky, které jsou v obrysu úzce kopinaté, oblé, dlouhé 2,5–6 cm a široké 6–9 mm. Nažky mají vytrvalý kalich, semenné pouzdro vřetenovitě kuželovité a jejich křídlo sahá cca do 1/2 semenného pouzdra.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Jasan pensylvánský je pionýrská dřevina, která rychle osidluje břehy řek a narušovaná místa. Roste v nížinách a nivách řek, kde je vystavován občasným záplavám nebo také na mírných jižních svazích. Vyhovuje mu jílovitá až bahnitá půda na neutrálním až bazickém podkladu, ale roste také na hrubě texturovaných píscích s dostatečnou vlhkostí. Jedná se o dřevinu, která je tolerantní k zastínění a zároveň velmi adaptačně flexibilní.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={1}/>
			<PopulationDensity score={1}/>
			<EnvironmentImpact score={1}/>
			<ManagementMethod text="kácení, aplikace herbicidu"/>
			<ManagementApplication text="lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>Hejný S. (1997) Květena České Republiky. Academia, Praha</Resource>
			<Resource>Kubát, K., Hrouda, L., Chrtek, J. jun., Kaplan, Z., Kirschner, J., Štěpánek J (ed) (2002) Klíč ke květeně České republiky. Academia.</Resource>
			<Resource><a href="http://www.botany.cz" target="_blank">www.botany.cz</a>; 2007-2019</Resource>
			<Resource><a href="http://www.pladias.cz" target="_blank">www.pladias.cz</a>; 2014-2019</Resource>
			<Resource><a href="https://plants.usda.gov" target="_blank">https://plants.usda.gov</a> 2019</Resource>
		</Resources>
	</div>
);

export default JasanPensylvansky;