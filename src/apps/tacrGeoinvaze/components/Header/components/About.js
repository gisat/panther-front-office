import React from 'react';

export default props => (
	<>

		<h3>Zahrnuté druhy</h3>
		<p>Mapové výstupy byly vytvořeny pro vybrané druhy vyskytující se ve volné krajině, mimo kultury a intravilán, a druhy s vysokým impaktem na přírodě blízká společenstva a ekosystémy. Pro potřeby portálu byly vybrány druhy na tzv. Unijním seznamu invazních druhů (seznam druhů k nařízení EU 1143/2014), druhy Černého a šedého seznamu ČR (Pergl et al. 2016) a některé druhy tzv. watch listu. Z watch listu byly vybrány druhy v současné době dosud nerozšířené, ale vykazující invazní chování v na jiných místech Evropy a z ekologického hlediska potenciálně schopné se šířit na naše území.</p>
		<p>Funkční skupiny</p>
		<p>Pro potřeby tvorby modelů byly druhy rozděleny do tzv. „funkčních skupin“ s ohledem na jejich biologii, ekologie a způsob šíření. Druhy živočichů byly rozděleny dle preferovaného prostředí výskytu na druhy vázané na vodní prostředí a druhy terestrické. Dále pak byly skupiny rozděleny dle taxonomické příslušnosti. Cévnaté rostliny byly rozděleny na vodní a terestrické, terestrické pak na byliny a dřeviny. Pro jednotlivé funkční skupiny byl použit shodný algoritmus konstrukce map a modelů. Algoritmy tvorby modelů se liší pro jednotlivé funkční skupiny a jsou popsány v kapitole Metodika – Konstrukce predikčních modelů.</p>
		<h4>Živočichové – suchozemští</h4>
		<ul>
			<li>Neovison vison</li>
			<li>Nyctereutes procyonoides</li>
			<li>Ondatra zibethicus</li>
			<li>Procyon lotor</li>
		</ul>

		<h4>Živočichové – vázaní na vodní prostředí</h4>
		<ul>
			<li>Astacus leptodactylus</li>
			<li>Oronectes limosus</li>
			<li>Pacifastacus leniusculus</li>
			<li>Corbicula fluminea</li>
			<li>Dikerogammarus villosus</li>
			<li>Dreissena polymorpha</li>
			<li>Pectinatella magnifica</li>
			<li>Sinanodonta woodiana</li>
			<li>Trachemys scripta</li>
			<li>Myocastor coypus</li>
		</ul>

		<h4>Rostliny vodní</h4>
		<ul>

		</ul>

		<h4>Rostliny suchozemské</h4>
		<ul>
			<li>Amorpha fruticosa</li>
			<li>Buddleja davidii</li>
			<li>Colutea arborescens</li>
			<li>Cornus sericea</li>
			<li>Dipsacus strigosus</li>
			<li>Echinops exaltatus</li>
			<li>Echinops sphaerocephalus</li>
			<li>Fallopia aubertii</li>
			<li>Helianthus tuberosus</li>
			<li>Heracleum mantegazzianum</li>
			<li>Laburnum anagyroides</li>
			<li>Lonicera caprifolium</li>
			<li>Lupinus polyphyllus</li>
			<li>Lycium barbarum</li>
			<li>Mahonia aquifolium</li>
			<li>Parthenocissus inserta</li>
			<li>Parthenocissus quinquefolia</li>
			<li>Pyracantha coccinea</li>
			<li>Reynoutria ×bohemica</li>
			<li>Reynoutria japonica</li>
			<li>Reynoutria sachalinensis</li>
			<li>Rudbeckia laciniata</li>
			<li>Solidago canadensis</li>
			<li>Solidago gigantea</li>
			<li>Symphiotrichon sp.</li>
			<li>Symphoricarpos albus</li>
			<li>Telekia speciosa</li>
		</ul>

		<h4>Dřeviny</h4>
		<ul>
			<li>Acer negundo</li>
			<li>Ailanthus altissima</li>
			<li>Pinus nigra</li>
			<li>Pinus strobus</li>
			<li>Populus balsamifera</li>
			<li>Prusnus cerasifera</li>
			<li>Quercus rubra</li>
			<li>Quercus rubra</li>
			<li>Rhus typhina</li>
			<li>Robinia pseudoacacia</li>
		</ul>

		<h4>Nezobrazované druhy</h4>
		<p>Ze zobrazování byly vyjmuty druhy, které se v ČR vyskytují buď velmi málo a mají malý environmentální dopad, nebo netvoří stálé populace, a zároveň druhy, které se vyskytují po celém území ČR na mnoha různých stanovištích a výskyt je v rámci ČR celoplošný. U takových druhů nemá vizuální prezentace valného významu. V rámci portálu nejsou zobrazovány druhy s celoplošným výskytem v rámci ČR (např. muflon evropský (Ovis musimon), jelen sika (Cervus nippon), pcháč rolní (oset) (Cirsium arvense) či ořešák královský (Juglans regia) a další druhy s podobným výskytem). Další skupinou druhů jsou druhy obecně rozšířené, pro které byly vytvořeny mapy současného a historického rozšíření, ale nemá smysl modelovat další šíření, jelikož druhy se již vyskytují na většině území ČR. Jde např. o psíka mývalovitého (Nyctereutes procyonoides), ondatru pižmovou (Ondatra zibethicus), mývala severního (Procyon lotor), z rostlinných druhů pak např. netýkavka malokvětá (Impatiens parviflora). Dále nejsou zahrnuty druhy jejichž výskyt nezávisí na podmínkách prostředí, ale spíše na lidských aktivitách, tedy všechny formy kultur. Pod tímto pojmem jsou zahrnuty plantáže, chovy v oborách, zájmové chovy ve volné přírodě atd. Dále nejsou zahrnuty druhy, které sice mají vysoký impakt (např. ambrosie peřenolistá (Ambrosia artemissifolia), ale jejich populace jsou v čase nestálé a výskyt je závislý na náhodných faktorech.</p>

	</>
);