import React from 'react';

export default props => (
	<>

		<h3>Metodika</h3>
		<h4>Vstupní data o výskytu druhů</h4>
		<p>Mapy současného výskytu jednotlivých druhů byly vytvořeny jako kompilát vlastních a již publikovaných dat. Jako základní datový vstup byla použita databáze ND OP AOPK ČR, doplněná o další publikované zdroje a vlastní publikovaná (Berchová et al. 2017, 2018 a 2019) a jinde nepublikovaná data.</p>

		<h4>Vstupní data pro mapové výstupy z predikčních modelů a konstrukce modelů</h4>
		<p>Vstupními daty jsou jednak data z nálezové databáze AOPK a dále vrstvy definující podmínky prostředí s ohledem na šíření daného druhu – ať už z pozitivního (podmínky vhodné pro šíření) nebo negativního (podmínky omezující šíření) pohledu. Vrstvy definující podmínky jsou:</p>
		<p>Konsolidovaná vrstva ekosystémů (KVES), kde jednotlivým typům ekosystémům byly přiřazené váhy, zohledňující vhodnost pro šíření daného druhu</p>
		<p>Vrstva nadmořských výšek (DMT), odvozená z dat SRTM DEM</p>
		<p>Vrstva komunikací převzatá z Open Street Maps databáze (OSM)</p>
		<p>Vrstva vodních toků odvozená z KVES</p>
		<p>Všechny vstupní vrstvy byly rasterizovány s krokem 30m a vlastní modelování probíhá nad rastrovými daty.</p>
		<p>Pro modely maximálního rozšíření byly jako vstupní proměnné prostředí použity nadmořská výška digitálního modelu terénu EU-DEM v1.1 (Copernicus), konsolidovaná vrstva ekosystémů (KVES) (AOPK ČR) a vzdálenosti od vektorů šíření. Ty byly rozděleny na vrstvu vzdálenosti od vodních toků a vrstvu vzdáleností od komunikací. Jako komunikace byly uvažovány silnice, dálnice a železnice. Dále byly do proměnných prostředí zahrnuty bioklimatické faktory. Konkrétně minimální teplota v nejchladnějším měsíci a průměrná teplota v nejchladnější čtvrtině roku (worldclim.org).</p>

		<hr/>

		<h3>Methods</h3>
		<h4>Input data – species distribution</h4>
		<p>Maps of the present occurrence of individual species were created as a compilation of own and already published data. As a basic data input, the Nature Conservation Agency of the Czech Republic  database was used, supplemented by other published sources and own published data (Berchová et al. 2017, 2018 and 2019) and data not published elsewhere.</p>
		<h4>Other input data for modelling</h4>
		<p>Input data for both types of modelling are data from Nature Conservation Agency of the Czech Republic  database (species distribution) and layers defining environmental conditions with respect to the distribution of a given species - whether from a positive (conditions suitable for propagation) or negative (conditions restricting the propagation) perspective. environmental conditions determining the presence and spreading of modelled species.</p>
		<p>Environmental conditions defining layers:</p>
		<p>Consolidated layer of ecosystems of the Czech Republic (KVES ČR) -  weights have been assigned to each type of ecosystem, taking into account suitability for the spread of the species</p>
		<p>Layer of digital elevation model (SRTM DEM)</p>
		<p>Layer of roads and railways (Open Street Maps)</p>
		<p>Layer of water courses and water bodies (KVES ČR)</p>
		<p>All input layers were transformed to raster (30×30m) for implementation into models.</p>
		<p>For models of maximal potential distribution were used following environmental layers: Digital elevation terrain model EU-DEM 1.1 (Copernicus)</p>
		<p>Consolidated layer of ecosystems of the Czech Republic (KVES ČR)</p>
		<p>Distance from spreading vector (buffers around roads/railways and around water courses)</p>
		<p>Bioclimatic factors (based on worldclim.org database).</p>

	</>
);