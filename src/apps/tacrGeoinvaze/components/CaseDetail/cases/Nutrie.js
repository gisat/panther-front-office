import React from "react";
import {Title, TextBlock, InvasivePotential, InvasivePotentialCategory, Summary, SummaryItem} from "../components";

const Nutrie = props => (
	<div>
		<Title name="Nutrie říční" latinName="Myocastor coypus/Mus coypus"/>
		<Summary>
			<SummaryItem title="Původní areál" text="Jižní Amerika"/>
			<SummaryItem title="Sekundární areál" text="Severní Amerika, Evropa, Asie, Austrálie"/>
			<SummaryItem title="Introdukce" text="Únik z chovů"/>
			<SummaryItem title="Pěstování/Chov" text="Na povolení Ministerstva životního prostředí"/>
		</Summary>
		<TextBlock>
			<p>Nutrie je jediným na našem území žijícím zástupcem rodu nutrie. Jde o středně velkého hlodavce, délka těla dosahuje 40-60 cm bez ocasu, s ocasem až k metru u dospělých samců. Nutrie mají nejčastěji hnědé nebo šedé zabarvení, nicméně z chovů mohou uniknout i jiné barevné varianty (bílá, zlatá, černá). Srst nutrií je hustá, ovšem na tlapkách a ocasu chybí. Výrazným znakem nutrie říční jsou výrazné, oranžově zabarvené řezáky. Dalším výrazným znakem jsou plovací blány mezi prsty. Nutrie jsou chovány pro dietní maso a kožešiny. </p>
			<p>Nutrie je na Evropském seznamu nepůvodních invazních druhů a její záměrné šíření je protizákonné. Chov je povolován Ministerstvem ŽP.</p>
			<h5>Ekologie a způsob šíření</h5>
			<p>Nutrie obývají zejména travnaté a křovinaté břehy vodních toků a nádrží. Velkou část života tráví ve vodě. V březích si staví podzemní nory, které narušují stabilitu břehů a hrází. Nutrie je býložravec, spásá zejména vegetaci na březích a podél nich. Žije v sociálně uspořádaných skupinách čítajících až několik desítek jedinců. Je částečně teritoriální a teritoria jednotlivých matriarchálních rodin se překrývají.  Limitujícím faktorem pro šíření nutrií jsou nízké teploty v zimních měsících, kdy často dochází k omrzání neosrstěných částí těla a následným úhynům. Nutrie obývá v ČR nižší polohy, nicméně se v současné době šíří podél vodních toků i do poloh středních a vyšších.</p>
		</TextBlock>
		<InvasivePotential>
			<InvasivePotentialCategory name="Rozmnožování pohlavní" score={3}/>
			<InvasivePotentialCategory name="Rozmnožování nepohlavní" score={0}/>
			<InvasivePotentialCategory name="Ekologická nika" score={3}/>
			<InvasivePotentialCategory name="Hustota populací" score={3}/>
			<InvasivePotentialCategory name="Dopad na životní prostředí" score={2}/>
			<InvasivePotentialCategory name="Management metoda" text="odchyt"/>
			<InvasivePotentialCategory name="Management aplikace" text="řídká, lokálně"/>
		</InvasivePotential>
	</div>
);

export default Nutrie;