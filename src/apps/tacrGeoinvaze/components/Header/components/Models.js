import React from 'react';
import models00 from '../../../assets/models00.png';
import models01 from '../../../assets/models01.png';
import models02 from '../../../assets/models02.png';
import models00en from '../../../assets/models00en.png';
import models01en from '../../../assets/models01en.png';
import models02en from '../../../assets/models02en.png';

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

		<hr/>

		<h3>Methods</h3>
		<h4>Maps of the present occurrence of individual species</h4>
		<p>The maps of the present occurrence of individual species are one of project inputs. The occurrence maps were created on the basis of exact localities of species occurrence generalized to the localization of findings in Central European mapping network. The assignment accuracy is one quarter of the base field (quadrant). However, records stored in the database with only basic field accuracy (ie 6 ′ latitude × 10 ′ longitude, approximately equivalent to an area of 12.0 × 11.1 km at the 50th parallel) are included too. Coordinate-localized records were converted to network mapping quadrants for the purpose of these maps.</p>
		<p>The nomenclature of the scientific names of the species was chosen for plants according to the Flora of the Czech Republic (1-8). The nomenclature according to Pfleger (1999) was chosen  for Czech names of aquatic molluscs and the nomenclature according to Andera (1999) was chosen for Czech names of animals.</p>
		<h4>Map outputs from prediction models and model construction</h4>
		<h5>Construction of IAS prediction models</h5>
		<p>The idea of geoportal (and subsequent modelling) is based on interconnection of application server with invasive species occurrence database, which is managed by Nature Conservation Agency of the Czech Republic.  In the given period (3 months), the application server automatically downloads the current state of the invasive species occurrence database via the API and then performs modelling in the background. The model results are then visualized on the map portal, which has the basic functionality for data viewing (zoom, interviewing, selection of the area of interest). Thus, online modelling of user scenarios (what happens if I liquidate the selected occurrence… etc.) is not expected. The basic principle of operation of the whole system is shown schematically in the following figure (Fig. 1).</p>

		<img src={models00en} style={{maxWidth:"50rem"}} />

		<i className="tacrGeoinvaze-image-decsription">Fig. 1 - Basic scheme of modelling biological invasions geoportal functionality</i>

		<p>Two types of models were created for the occurrence prediction, namely models of maximum possible species distribution based on the BIOMOD tool and models taking into account the current occurrence with subsequent prediction of spreading in certain time horizons, so-called mechanistic models.</p>
		<h4>1. Models of maximum possible species distribution</h4>
		<p>Statistical model R (R Development Core Team) extended by biomod2 package was used to model the maximum possible IAS distribution. The modelling itself was carried out using a generalized linear model (GAM), a gradient boosting model (GBM) and a maximum entropy model (MAXENT).</p>
		<h4>2. Mechanistic models</h4>
		<p>Mechanistic modelling uses standard tools of geoinformation systems for data analysis and modelling - transformation between coordinate systems, database selections, creation of buffers and combinations of data layers. The whole solution is based on Open Source tools (PostGIS database, GDAL and OGR libraries, Python programming language).</p>
		<p>The approach to modelling varies by functional group. In general, the algorithms are different for terrestrial animals, for aquatic ecosystem-related animals and plants and for terrestrial plants.</p>
		<h5>2a. Terrestrial animals modelling</h5>
		<p>Since the animal species spreading can occur essentially across ecoregions, this part of modelling is limited to visualize the current status of the species distribution based on the update of the Nature Conservation Agency of the Czech Republic database, automatically imported into the system within a given three-month period.</p>
		<h5>2b. Aquatic ecosystem-related animals and plants modelling</h5>
		<p>A separate modeling algorithm was developed for species strictly bound to the habitat (Myocastor coypus, which is bound to watercourses and is essentially limited to altitude).</p>
		<h5>2c. Terrestrial plants modelling</h5>
		<p>The Consolidated layer of ecosystems of the Czech Republic (KVES) is main layer for plant species modelling (in addidion to the occurrence layer taken from the Nature Conservation Agency of the Czech Republic database of course). In this layer, weights are assigned to individual ecosystems taking into account their suitability for the spread of the species. A watercourses, roads/railroads layers (representing vectors of spreading) serve as an auxiliary layers.</p>
		<p>The basic idea of the model is that if the occurrence site is adjacent to a habitat suitable for the distribution of the species (the habitat is assigned a non-zero weight), the species can spread into it. The propagation rate (ie. the number of adjacent pixels in the raster layer that will be "occupied") was set at 30m / year – ie. all suitable pixels immediately adjacent to the pixel representing IAS occurrence site will be occupied (Fig. 2).</p>

		<img src={models01en} style={{maxWidth:"50rem"}} />

		<i className="tacrGeoinvaze-image-decsription">Fig. 2: Principle of spreading modelling in raster model</i>

		<p>If the occurrence site is in close proximity to a watercourse or road/railroad, these line elements serve as propagation vectors and all appropriate pixels located at a distance of 90m along the line element will be occupied. In the case of roads/railroads this distance is taken in both directions, in the case of watercourses only in the direction of the flow (Fig. 3).</p>

		<img src={models02en} style={{maxWidth:"50rem"}} />

		<i className="tacrGeoinvaze-image-decsription">Fig. 3: Principle of spreading modelling in raster model taking into account linear propagation vectors</i>

		<p>The output of the model for the first year becomes the input for modelling the spreading in the next time interval (modelling the situation after 3 years). The result of 3 years model is then the input for the model of the situation after 10 years. In other words - the result of the model for the first time period at the input replaces the so-called "state 0" – ie. the layer derived from the Nature Conservation Agency of the Czech Republic database, the calculation is performed over such modified inputs and the result is again taken as an initial state into the third round of calculation. A 4 raster layers, are results after completing all steps and these layers are then visualized on the map portal:</p>
		<p>Situation in "time 0" – ie. visualization of the occurrence database (current status at the date of calculation)<br/>
		Situation after 1 year<br/>
		Situation after 3 years<br/>
			Situation after 10 years<br/></p>
		<p>The division of the results into classes and the colour scheme of the visualization correspond to the weights assigned to the individual habitats in the KVES layer and reflect the susceptibility of the ecosystem to invasion by the species.</p>
	
	</>
);