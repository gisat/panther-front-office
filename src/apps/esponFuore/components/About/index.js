import React from 'react';

import EsponHeader from "../EsponHeader";
import Footer from "../Footer";

class About extends React.PureComponent {
    render() {
        return (
            <>
                <EsponHeader fixed centered home/>
                <div className="esponFuore-about-page">
                    <div className="esponFuore-about-page-content">
                        <h1>About the ESPON FUORE tool</h1>
                        <p>In order to improve the relevance, efficiency and effectiveness of the policymaking and implementation process in functional urban areas and other functional regions, it is essential to have data, indicators and analysis tools that can help to better understand the drivers for growth and inclusive social development in these areas. However, data required for decision-making is generally available only for administrative territorial units or there are significant breaks in time series whenever data may exist.</p>
                        <p>The ESPON FUORE web tool provides hundreds of <b>estimated</b> demographic and socio-economic time series indicators for several types of functional areas. The web tool allows to quickly analyse and benchmark any of the functional areas by means of interactive maps and charts. The estimation is based on disaggregation of NUTS 2 and NUTS 3 indicators to 1X1 km grids by means of different ancillary datasets, such as the European Settlement Map (ESM) and Corine Land Cover Refined, following the “<a href="https://ec.europa.eu/jrc/en/publication/mapping-population-density-functional-urban-areas-method-downscale-population-statistics-urban-atlas" target="_blank" rel="noreferrer noopener">dasymetric mapping</a>” method. The downscaled indicators are eventually aggregated back from 1X1 km grid to the different functional areas. </p>
                        <p>The FUORE tool contains nine pre-defined functional areas which have been established by the European Commission and various ESPON research projects. The list is by no means exhaustive and has been selected based on territorial coverage and availability of clear geometries that can be consistently applied over counties covered by the ESPON program:</p>
                        <ul>
                            <li><b>Functional Urban Areas</b> (Eurostat TERCET typology)</li>
                            <li><b>Coastal Areas</b> (Eurostat TERCET typology)</li>
                            <li><b>Maritime Service Areas</b> (Eurostat typology)</li>
                            <li><b>Mountain Areas</b> (ESPON 2013 GEOSPECS project)</li>
                            <li><b>Border Areas, 45 min reach</b> (ESPON 2013 GEOSPECS project)</li>
                            <li><b>Border Areas, 90 min reach</b> (ESPON 2013 GEOSPECS project)</li>
                            <li><b>Sparsely Populated Areas</b> (ESPON 2013 GEOSPECS project)</li>
                            <li><b>Islands</b> (ESPON 2013 GEOSPECS project)</li>
                            <li><b>Green Infrastructure Potential Areas</b> (ESPON 2020 GRETA project)</li>
                        </ul>
                        <p>
                            The demographic and socio-economic NUTS 2 and NUTS 3 indicators used for estimations come from ESPON 2020 Database and will be regularly updated. However, an integrated Custom Disaggregation Tool allows registered users to easily run the disaggregation-aggregation algorithm themselves. The tool allows to upload any user-selected NUTS-based indicator and estimate it by the functional area included in the FUORE tool. Currently, it is not possible to add user-generated customized functional areas. Any estimations can be eventually added as new publicly visible data in the FUORE web Tool.
                        </p>
                        <h2>History and Context</h2>
                        <p>The ESPON FUORE webtool is a product of <a href="https://www.espon.eu/functional-urban-areas-tool" target="_blank" rel="noreferrer noopener">ESPON 2020 project “Functional Urban Areas and Regions in Europe”</a>. It is built on a previous research carried out during the <a href="https://www.espon.eu/sites/default/files/attachments/M4D-DFR_TR-OLAP_draft_20140630.pdf" target="_blank" rel="noreferrer noopener">ESPON 2013 Multi Dimensional Database Design and Development (M4D) project</a> which developed several OLAP (Online Analytical Processing) cubes to estimate NUTS based indicators at different spatial scales. </p>
                        <p>The ESPON FUORE tool complements the work of the European Commission and OECD in terms of providing data and tools for analysis of urbanization:</p>
                        <ul>
                            <li>The <a href="https://ghsl.jrc.ec.europa.eu/ucdb2018Overview.php" target="_blank" rel="noreferrer noopener">GHSL Urban Centre Database</a> is the most complete database on cities to date, describing more than 10 000 urban centres around the globe with historical data.</li>
                            <li>The <a href="https://ghsl.jrc.ec.europa.eu/ghs_fua.php" target="_blank" rel="noreferrer noopener">GHSL Global Functional Urban Areas</a> estimates the extent of Metropolitan Areas around Urban Centre using a <a href="https://www.sciencedirect.com/science/article/pii/S0094119020300139?via%3Dihub" target="_blank" rel="noreferrer noopener">people-based definition</a> covering the entire world and using grid cells as spatial building blocks instead of local administrative units. A <a href="https://oecdregional.shinyapps.io/global_cities_visualization/" target="_blank" rel="noreferrer noopener">webtool</a> for analysis is offered as well.</li>
                        </ul>
                    </div>
                    <Footer/>
                </div>
            </>
        );
    }
}

export default About;

