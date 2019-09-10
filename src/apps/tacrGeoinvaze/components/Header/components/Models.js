import React from 'react';
import models00 from '../../../assets/models00.png';
import models01 from '../../../assets/models01.png';
import models02 from '../../../assets/models02.png';

export default props => (
	<>
		<h3>Metodika</h3>
		<h4>Mapy současného výskytu pro ČR</h4>
		<p>Mapy byly vytvořeny na základě přesných lokalit výskytu druhů generalizované na lokalizace nálezů v mapovací síti středoevropského síťového mapování s přesností čtvrtiny základního pole, tj. kvadrantu. Zahrnuty jsou však i záznamy uložené v databázi pouze s přesností základního pole (tj. 6′ zeměpisné šířky × 10′ zeměpisné délky, což v úrovni 50. rovnoběžky přibližně odpovídá území 12,0 × 11,1 km). Záznamy lokalizované pomocí souřadnic byly pro účely této prezentace přepočteny na kvadranty síťového mapování.</p>
		<p>Nomenklatura vědeckých názvů druhů byla zvolena u rostlin dle Květeny ČR (1-8). U živočichů U živočichů pak dle Pflegera (1999) pro české názvy vodních měkkýšů a dle Anděry (1999) pro české názvy živočichů.</p>
		
		<h4>Mapové výstupy z predikčních modelů a konstrukce modelů</h4>
		<h5>Konstrukce predikčních modelů IAS</h5>
		<p>Myšlenka geoportálu (a následného modelování) vychází z propojení aplikačního serveru s ND OP, která je spravovaná AOPK. Aplikační server si v dané periodě (3 měsíce) automaticky stáhne prostřednictvím API aktuální stav nálezové databáze a následně na pozadí provede modelování. Výsledky modelu jsou následně vizualizovány na mapovém portálu, který má základní funkcionalitu pro prohlížení dat (zoom, dotazování, výběr zájmového území). Nepředpokládá se tedy online modelování uživatelských scénářů (co se stane, pokud zlikviduji vybraný výskyt… apod). Základní princip fungování celého systému je schematicky zobrazený na následujícím obrázku (Obr. 1).</p>

		<img src={models00} style={{maxWidth:"50rem"}} />

		<i className="tacrGeoinvaze-image-decsription">Obr. 1: Základní schéma funkcionality geoportálu modelování biologických invazí</i>
		
		<p>V rámci predikcí výskytu byly vytvořeny dva typy modelů, a to modely maximálního možného rozšíření druhů na základě modelování pomocí nástroje BIOMOD a modely zohledňující současný výskyt s následnou predikcí šíření v určitých časových horizontech, tzv. mechanistické modely.</p>
		
		<h4>1.	Modely maximálního rozšíření</h4>
		<p>Pro modelování maximálního možného rozšíření IAS byl použit statistický software R (R Development Core Team) rozšířený o balík biomod2. Samotné modelování proběhlo za použití generalizovaného lineárního modelu (GAM), gradient boosting modelu (GBM) a modelu maximální entropie (MAXENT).</p>
		
		<h4>2.	Mechanistické modelování</h4>
		<p>Mechanistické modelování využívá standardních nástrojů geoinformačních systémů pro analýzu a modelování dat – transformace mezi souřadnými systémy, výběry z databáze, tvorba obalových zón (buffers) a kombinace datových vrstev. Celé řešení je postavené na Open Source nástrojích (databáze PostGIS, knihovny GDAL a OGR, programovací jazyk Python).</p>
		<p>Přístup k modelování se liší dle funkčních skupin. Obecně lze říci, že algoritmy jsou odlišné pro terestrické živočichy, pro živočichy a rostliny vázané na vodní ekosystémy a pro terestrické rostliny.</p>
		
		<h5>2a. Modelování pro terestrické živočišné druhy</h5>
		<p>Jelikož šíření živočišných druhů může nastávat v podstatě napříč ekoregiony, byla tato část omezená na vizualizaci aktuálního stavu rozšíření ke dni aktualizace nálezové databáze, automaticky importované do systému v dané, tříměsíční, periodě. V mapách aktuálního rozšíření jsou zahrnuty i změny abundancí v průběhu šíření druhu.</p>
		
		<h5>2b. Modelování pro živočichy a rostliny vázané na vodní ekosystémy</h5>
		<p>Pro druhy striktně vázané na biotop (jako příklad může sloužit druh Myocastor coypus, který je vázaný na vodní toky a je zásadně omezený nadmořskou výškou) byl vytvořen samostatný modelovací algoritmus.</p>
		
		<h5>2c. Modelování pro terestrické rostliny a dřeviny</h5>
		<p>Hlavní vrstvou pro modelování rostlinných druhů je (kromě vrstvy výskytů převzaté z nálezové databáze AOPK) databáze KVES, kde jsou jednotlivým ekosystémům přiřazené váhy zohledňující jejich vhodnost pro šíření daného druhu. Jako pomocné vrstvy slouží vrstva vodních toků a komunikací, reprezentující vektory šíření.</p>
		<p>Základní myšlenka modelu vychází z toho, že pokud místo nálezu sousedí s biotopem, vhodným pro šíření daného druhu (biotop má přiřazenou nenulovou váhu), daný druh se do něj může rozšířit. Rychlost šíření (tj. počet sousedících pixelů v rastrové vrstvě, které budou „obsazené") byla stanovená na 30m/rok – tj. obsazené budou všechny vhodné pixely, bezprostředně sousedící s místem nálezu (Obr. 2).</p>

		<img src={models01} style={{maxWidth:"50rem"}} />
		
		<i className="tacrGeoinvaze-image-decsription">Obr. 2: Princip modelování šíření v rastrovém modelu</i>
		
		
		<p>Pokud místo nálezu leží v těsném sousedství vodního toku nebo komunikace, tak tyto liniové prvky slouží jako vektory šíření a obsazené budou všechny vhodné pixely ležící ve vzdálenosti 90m podél liniového prvku. V případě komunikací se tato vzdálenost bere v obou směrech, v případě vodních toků pouze ve směru toku (Obr. 3).</p>

		<img src={models02} style={{maxWidth:"50rem"}} />
		
		<i className="tacrGeoinvaze-image-decsription">Obr. 3: Princip modelování šíření v rastrovém modelu při zohlednění liniových vektorů šíření</i>
		
		<p>Výsledek modelu pro 1. rok šíření se stává vstupem pro modelování šíření v dalším časovém intervalu (modelování situace po 3 letech). Výsledek tohoto modelu je následně vstupem pro model situace po 10 letech. Jinými slovy – výsledek modelu pro první časové období na vstupu nahrazuje tzv. „stav 0“- tj. vrstvu odvozenou z nálezové databáze, proběhne výpočet nad takto modifikovanými vstupy a výsledek je opět převzat jako iniciální stav do třetího kola výpočtu. Po dokončení všech kroků jsou výsledkem 4 rastrové vrstvy, které jsou následně vizualizované na mapovém portálu:</p>
		<p>Situace v „čase 0“ – tj. vizualizace nálezové databáze<br/>
		Situace po 1 roce<br/>
		Situace po 3 letech<br/>
			Situace po 10 letech<br/></p>
		
		<p>Barevná škála vizualizace odpovídá vahám přiřazeným jednotlivým biotopům ve vrstvě KVES a odráží náchylnost ekosystému k invazi daným druhem.</p>
	
	</>
);