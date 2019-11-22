import React from "react";
import {
	Title,
	TextBlock,
	InvasivePotential,
	AsexualReproduction,
	SexualReproduction,
	Summary,
	Resource,
	Resources,
	EcologicalNiche,
	PopulationDensity,
	EnvironmentImpact,
	ManagementMethod,
	ManagementApplication,
	OriginalArea, SecondaryArea, Introduction, Breeding
} from "../components";

const Nutrie = props => (
	<div>
		<Title name="Nutrie říční" latinName="Myocastor coypus/Mus coypus"/>
		<Summary>
			<OriginalArea text="Jižní Amerika"/>
			<SecondaryArea text="Severní Amerika, Evropa, Asie, Austrálie"/>
			<Introduction text="Únik z chovů, záměrné vypouštění"/>
			<Breeding text="Na povolení Ministerstva životního prostředí"/>
		</Summary>
		<TextBlock>
			<p>Nutrie je jediným na našem území žijícím zástupcem rodu nutrie. Jde o velkého hlodavce, délka jeho těla dosahuje 40-80 cm, ocasu 30-50 cm a hmotnost dospělých samců je až 12 kg. Nutrie mají nejčastěji hnědé nebo šedé zabarvení, nicméně z chovů mohou uniknout i jiné barevné varianty (bílá, zlatá, černá). Srst nutrií je hustá, ovšem na tlapkách a šupinatém ocasu chybí. Charakteristické jsou výrazné, oranžově zabarvené řezáky. Dalším typickým znakem jsou plovací blány mezi prsty, chlopňovité uzavíratelné nozdry a na rozdíl od zaměnitelných hlodavců (bobr, ondatra) oválný až kulatý průřez ocasu. Nutrie jsou chovány pro dietní maso a kožešiny.</p>
			<p>Nutrie je na Evropském seznamu nepůvodních invazních druhů a její záměrné šíření je protizákonné. Chov je povolován Ministerstvem ŽP.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Nutrie obývají zejména travnaté a křovinaté břehy vodních toků a nádrží. Velkou část života tráví ve vodě. V březích si staví podzemní nory, které mohou narušovat stabilitu břehů a hrází. Nutrie je býložravec, spásá zejména vegetaci na březích a podél nich. Žije v sociálně uspořádaných skupinách čítajících až několik desítek jedinců. Je částečně teritoriální a teritoria jednotlivých matriarchálních rodin se překrývají.  Limitujícím faktorem pro šíření nutrií jsou nízké teploty v zimních měsících, kdy často dochází k omrzání neosrstěných částí těla a následným úhynům. Nutrie obývá v ČR nižší polohy, nicméně se v současné době šíří podél vodních toků i do poloh středních a vyšších. V jižní a západní Evropě je brána za značně nebezpečný druh narušující stabilitu břehů vodních toků a nádrží.</p>
		</TextBlock>
		<InvasivePotential>
			<SexualReproduction score={3}/>
			<AsexualReproduction score={0}/>
			<EcologicalNiche score={3}/>
			<PopulationDensity score={3}/>
			<EnvironmentImpact score={2}/>
			<ManagementMethod text="odchyt"/>
			<ManagementApplication text="řídká, lokálně"/>
		</InvasivePotential>
		<Resources>
			<Resource>
				Anděra M., Červený J., 2003a: Výskyt nutrie (<i>Myocastor coypus</i>) v České republice. Lynx, n. s. (Praha), 34:5-12.
			</Resource>
			<Resource>
				Anděra M., Červený J., 2003b: Červený seznam savců České republiky. Příroda,22: 139-149.
			</Resource>
			<Resource>
				Anděra M., Červený J., 2004: Atlas rozšíření savců v České republice. Předběžná verze IV. Hlodavci (Rodentia) - část 3 Veverkovití (Sciuridae), bobrovití (Castorodae), nutriovití (Myocastoridae). Národní muzeum, Praha,76 pp.
			</Resource>
			<Resource>
				Anděra M., Gaisler J., 2019: Savci České republiky: rozšíření, ekologie ochrana. 2. upravené vydání. Academia Praha, 286 str.
			</Resource>
		</Resources>
	</div>
);

export default Nutrie;