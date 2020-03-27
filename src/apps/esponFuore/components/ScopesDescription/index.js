import React from 'react';

import './style.scss';
import {NavLink} from "react-router-dom";
import Icon from "../../../../components/common/atoms/Icon";

import fua from "../../assets/regions/fua.png";
import greenInfrastructure from "../../assets/regions/green-infrastructure.png";
import bordersNarrow from "../../assets/regions/borders-narrow.png";
import bordersLarge from "../../assets/regions/borders-large.png";
import spa1 from "../../assets/regions/spa-1.png";
import spa2 from "../../assets/regions/spa-2.png";
import islands from "../../assets/regions/islands.png";
import mountains from "../../assets/regions/mountains.png";
import msaCoasts from "../../assets/regions/msa-coasts.png";
import coasts from "../../assets/regions/coasts.png";

class ScopesDescription extends React.PureComponent {

	render() {
		return (
			<div className="esponFuore-scopes-description">
				<div className="esponFuore-scopes-description-menu">
					<div className="esponFuore-scopes-description-menu-content">
						<NavLink className="ptr-button invisible" to={"/#links"}><Icon icon="arrow-left"/><div className="ptr-button-caption">Main page</div></NavLink>
						<div className="esponFuore-scopes-description-menu-content-links">
							<NavLink to="#fua">Functional urban areas</NavLink>
							<NavLink to="#tcoa">TERCET Coast</NavLink>
							<NavLink to="#msa">Maritime service areas</NavLink>
							<NavLink to="#mtn">Mountains</NavLink>
							<NavLink to="#isl">Islands</NavLink>
							<NavLink to="#spa">Sparsely populated areas</NavLink>
							<NavLink to="#green-infrastructure">Green infrastructure</NavLink>
							<NavLink to="#border-narrow">Border narrow</NavLink>
							<NavLink to="#border-large">Border large</NavLink>
						</div>
					</div>
				</div>
				<div className="esponFuore-scopes-description-content">
					<h1>Delineation principles</h1>
					<h2 id="fua">Eurostat TERCET: Functional urban areas (FUA) 2015-2018</h2>
					<p>According to TERCET, a FUA consists of a city (i.e. an urban centre with a population of more than 50’000) and its commuting zone whose labour market is highly integrated with the city. In some places with high urban concentration, FUAs can be overlapping. </p>
					<p>FUA’s delineation evolves over time. The latest version available at the time of ESPON FUORE project has been used. It is the “2015-2018 Urban Audit delineations”, based on the census commuting data from 2011 and onwards. More information on Eurostat TERCET LAU typologies are available at <a href="https://ec.europa.eu/eurostat/web/nuts/tercet-territorial-typologies" target="_blank">Eurostat website</a>.</p>
					<p>Turkish FUAs were “created” by the Service provider in charge of Urban Atlas upon EEA request. They derive from the methodology used for the other (official) FUAs. For further information see <a href="https://land.copernicus.eu/user-corner/technical-library/oecd-definition-of-functional-urban-area-fua" target="_blank">methodology</a>.</p>

					<img className="esponFuore-doc-image" src={fua}/>

					<h2 id="tcoa">Eurostat TERCET Coast (TCOA) 2016</h2>
					<p>TERCET provides a morphological delineation of coasts, with two criteria a LAU must fulfil:</p>
					<ol>
						<li>Being contiguous to coast;</li>
						<li>And/or having ≥ 50 % of surface area within 10 km of the coastline.</li>
					</ol>
					<p>Additionally, a LAU can be added/retracted at request from a member state. </p>
					<p>2016 and 2017 LAU coastal nomenclatures have been produced at the time of ESPON FUORE project, but only the 2016 had been validated by member state. Validation process is however significant. For example, the LAU of Rotterdam (largest Harbour in EU, contiguous to the sea) has been retracted by Netherlands from TERCET 2016 coastal typology, because its socio-economic mass would distort the Dutch coastal tourism data. As a result, Eurostat strongly suggested using the 2016 version.</p>
					<p>More information on Eurostat TERCET LAU typologies are available at <a href="https://ec.europa.eu/eurostat/web/nuts/tercet-territorial-typologies" target="_blank">Eurostat website</a>.</p>

					<img className="esponFuore-doc-image" src={coasts}/>

					<h2 id="msa">EUROSTAT Maritime service areas (MSA)</h2>
					<p>Whereas TERCET coast is based on a geographic buffer of 10 kilometres, MSA provide a complementary information on costal functionalities, i.e. population and activities located within a commuting distance from coasts.</p>
					<p>MSA are the areas that can be reached within a given travelling time, starting from a location at the coast and using the existing transport network. Travelling time depends on the points of interactions on the shoreline (large ports, small ports and coastal settlements). The complete coverage of service areas from any port was calculated for each LAU. This resulted in a set of 26’700 LAUs with more than 5 % of their surface area covered by a service area. More detail in Eurostat MSA delineation methodology can be accessed at <a href="https://ec.europa.eu/eurostat/documents/3433488/5579348/KS-SF-11-041-EN.PDF/37ab2179-1401-4abf-8768-61a9d0f7e3af">Eurostat website</a>.</p>
					<p>However, coasts of Croatia, Island, Norway, Turkey and the French island of Mayotte are not delineated in the MSA file. For these countries MSA file has been completed with the GEOSPECS coastal LAUs. That delineation is based on 45 minutes driving time-distance access to coast (more than 50% of their surface accessible in less than 45 minutes) + all LAU contiguous to coast that would not fulfil the first criteria. While the methodology is also based on time-distance and respects the 45 minutes commuting time to large ports used in the MSA, it must be kept in mind that, despites results are similar for these countries, they must be compared with caution. More details on Coastal areas delineation methodology used in GEOSPECS are available in the <a href="https://www.espon.eu/sites/default/files/attachments/GEOSPECS_Final_scientific_report_v2_-_revised_version.pdf" terget="_blank">ESPON GEOSPECS Final Scientific Report, pp. 87-105</a>.</p>

					<img className="esponFuore-doc-image" src={msaCoasts}/>

					<h2 id="mtn">ESPON GEOSPECS Mountains (MTN)</h2>
					<p>GEOSPECS mountain delineation is based on altitude, terrain roughness and slope, building on studies conducted for the European Commission’s Directorate-General for Regional Policy and the European Environment Agency (EEA 2010). This set of grid cells with mountainous topography was approximated to 2008 LAU boundaries by considering that LAU units with more than 50% mountainous terrain should be characterised mountainous. </p>
					<p>Continuous mountain areas of less than 100 km2 were then identified and designated as “exclaves”, which were excluded from the GEOSPECS mountain delineation (except on islands of less than 1000 km2).  Similarly, non-mountainous groups of LAU units of less than 200 km2 surrounded by mountain areas were identified as “enclaves” and included in the GEOSPECS mountain delineation. Mountain areas have been grouped into 16 massifs.</p>
					<p>It is important to note that this delineation, which is based on a single set of criteria applied across ESPON space, has been produced for analytical purposes. It is not proposed as an alternative to the designations of EU Member States with respect to their mountain Less Favour Areas (LFA), as referred to by article 18 of Council Regulation 1257/1999. These mountain LFAs are designated using different criteria in each country.</p>
					<p>More details on Mountains delineation methodology are available in the <a href="https://www.espon.eu/sites/default/files/attachments/GEOSPECS_Final_scientific_report_v2_-_revised_version.pdf" target="_blank">ESPON GEOSPECS Final Scientific Report, pp. 57-62</a>.</p>

					<img className="esponFuore-doc-image" src={mountains}/>

					<h2 id="isl">ESPON GEOSPECS Islands (ISL)</h2>
					<p>GEOSPECS Islands are a given morphological delineation: it is about a LAU (or group of LAUs) that is surrounded by sea. All territories that are physically disjoint from the European mainland or the main islands of the British Isles (UK and Ireland) are considered as insular, including parts of municipalities, but excluding inland islands.</p>
					<p>Given that fixed links are considered to merely alter the intensity of insularity, islands connected to the mainland by a fixed road link have been included. Multiple islands belonging to one municipality have been considered as one unit. Oppositely, multiple municipalities, which form part of one island, have been grouped together.</p>
					<p>ESPON FUORE has added three French islands to ESPON GEOSPECS project delineation: Saint Martin & Saint-Barthelemy in the Caribbean Sea and the 17 LAU making the island of Mayotte in the Indian Ocean. This was necessary as the result of change in their administrative status since 2010.</p>
					<p>More details on Islands delineation are available in the <a href="https://www.espon.eu/sites/default/files/attachments/GEOSPECS_Final_scientific_report_v2_-_revised_version.pdf" target="_blank">ESPON GEOSPECS Final Scientific Report, pp. 63-72</a>.</p>

					<img className="esponFuore-doc-image" src={islands}/>

					<h2 id="spa">ESPON GEOSPECS Sparsely populated areas (SPA)</h2>
					<p>GEOSPECS SPAs are delineated based on population potential - i.e. the number of persons that are within a maximum generally accepted daily commuting or mobility area from each point in space. </p>
					<img className="esponFuore-doc-image" src={spa1}/>
					<p>The threshold is fixed at 100’000 persons, which corresponds to a population density of 12.7 persons/ km2. In the European policy-making spheres, the threshold of 12.5 persons/km2 is generally used to identify regions (at NUTS 3 level) that fall into the SPA category. Sparsity is calculated with a combination of two complementary approaches:</p>
					<ul>
						<li>Isotropic model: 1*1 km grid cells in Euclidian distance of 50 km (i.e. as the crow flies)</li>
						<li>Directed model: 1*1 km grid cells in 45min driving time (isochrones) using detailed road network modelling.</li>
					</ul>
					<p>Cells are then aggregated at LAU level. Only municipalities with over 90% sparsely populated area (either from isotropic or directed model) have been selected as SPA. In a second step, a total of 39 Sparse Territories have been identified, based on geographic contiguity and proximity and close socio-cultural proximity of sparse LAU units.</p>
					<p>More details on the delineation Sparsely Populated Areas are available in the <a href="https://www.espon.eu/sites/default/files/attachments/GEOSPECS_Final_scientific_report_v2_-_revised_version.pdf" target="_blank">ESPON GEOSPECS Final Scientific Report, pp. 73-86</a>.</p>
					<img className="esponFuore-doc-image" src={spa2}/>

					<h2 id="green-infrastructure">ESPON GRETA Green infrastructure (GI)</h2>
					<p>Based on the outcomes from the ESPON GRETA project, GI are areas with an elevated potential regarding green infrastructure. The source data used is the “GI Potential Network” map produced by GRETA, which is a 100x100m resolution binary raster stating if the cell has GI potential or not. That concept is related not only to the existence of “green” areas, but also to the patterns of potential services supplied by existing ecosystems and their conditions.</p>
					<p>The methodology to transfer the grid data into ESPON LAU census 2011 can be summarised as follow: </p>
					<ul>
						<li>Calculation of GI Potential Network average (mean) value by LAU.</li>
						<li>Definition of a >70% GI threshold for the average value to classify LAUs as high GI potential. </li>
						<li>Dissolving selected LAUs by country to create functional regions with high GI potential by country.</li>
					</ul>
					<p><a href="https://www.espon.eu/sites/default/files/attachments/GRETA_Final%20Report.pdf" target="_blank">More details on the ESPON GRETA Final Report, pp. 35-45</a></p>.
					<img className="esponFuore-doc-image" src={greenInfrastructure}/>

					<h2 id="border-narrow">ESPON GEOSPECS Border narrow (45 min)</h2>
					<p>OSPECS borders are based on driving time-distance to border, taking account therefore of the road accessibility to delineate various buffer zones of potential mutual influence. </p>
					<p>GEOSPECS identifies different types of border effects. Because the ranges of mobility and interaction associated to these different types vary, a general delineation of border areas was not produced. Instead, decision was made to select a “narrow” and a “broad” border among the variety of time distances computed.</p>
					<p>The GEOSPECS “45 minutes / max. 90km” delineation (= ±1 hour on Google Map) corresponds to the “narrow border”, a proxy for the maximum generally accepted commuting distance, where proximity cooperation is most likely to take place.</p>
					<p>More details on the ESPON GEOSPECS methodology to delineate Border areas can be consulted in the project’s <a href="https://www.espon.eu/sites/default/files/attachments/GEOSPECS_Final_scientific_report_v2_-_revised_version.pdf" target="_blank">Final Scientific Report, pp. 106-134</a>.</p>
					<img className="esponFuore-doc-image" src={bordersNarrow}/>

					<h2 id="border-large">ESPON GEOSPECS Border large (90 min)</h2>
					<p>GEOSPECS borders are based on driving time-distance to border, taking account therefore of the road accessibility to delineate various buffer zones of potential mutual influence. </p>
					<p>GEOSPECS identifies different types of border effects. Because the ranges of mobility and interaction associated to these different types vary, a general delineation of border areas was not produced. Instead, decision was made to select a “narrow” and a “broad” border among the variety of time distances computed.</p>
					<p>The GEOSPECS “90 min /max 180 km” delineation (= ±2 hour on Google Map) corresponds to the “broad border”, providing a larger perspective to potential border influence.</p>
					<p>All LAUs contiguous to border have been added to this category. Indeed contiguity - even in case of insufficient road accessibility to border as it is the case in northern Scandinavia or in the Alps among others - can potentially lead to cooperation stakes on the example of cross-border nature conservation areas.</p>
					<p>More details on the ESPON GEOSPECS methodology to delineate Border areas can be consulted in the project’s <a href="https://www.espon.eu/sites/default/files/attachments/GEOSPECS_Final_scientific_report_v2_-_revised_version.pdf" target="_blank">Final Scientific Report, pp. 106-134</a>.</p>
					<img className="esponFuore-doc-image" src={bordersLarge}/>
				</div>
			</div>
		);
	}

}

export default ScopesDescription;

