import React from "react";
import {NavLink} from "react-router-dom";
import Helmet from "react-helmet";
import Fade from "react-reveal/Fade";
import Jump from "react-reveal/Jump";
import Icon from "../../../components/common/atoms/Icon"

export const PageIndex = props => {
		const places = props.places;

	return (
		<div className="tacrAgritas-index">
			<Helmet
				defaultTitle="AGRITAS portál"
			/>
			<div className="tacrAgritas-index-background">
			</div>
			<div className="tacrAgritas-index-content">
				<h1>AGRITAS portál</h1>
				<p>Biofyzikální monitoring, fenologické a produkční charakteristiky porostů zemědělský plodin, Srovnání aktuálního stavu zemědělský porostů s dlouhodobým normálem (1985 - 2015).</p>
				<div className="tacrAgritas-index-cta">
					<Jump delay={1500}>
						<Icon icon="arrow-left"/>
					</Jump>
					<span>Začněte výběrem farmy</span>
				</div>

				<Fade left cascade distance="50px">
					<div className="tacrAgritas-index-cards">
						{places.map(place =>
								<NavLink
									key={place.key}
									to={"/" + place.key}
									className={`tacrAgritas-index-card ${place.key} ${place.data.bbox ? "" : "disabled"}`}
								>
									<div className="tacrAgritas-index-card-content">
										<div className="tacrAgritas-index-card-title">{place.data.nameDisplay}</div>
										<div className="tacrAgritas-index-card-subtitle">{place.data.description}</div>
									</div>
								</NavLink>
						)}
					</div>
				</Fade>
			</div>
			<div className="tacrAgritas-index-footer">
				<p>Vývoj tohoto mapového portálu a metodiky pro kvantitativní odhad hodnot biofyzikálních charakteristik porostů zemědělských plodin byl podpořen Technologickou Agenturou České Republiky (TA ČR) v rámci projektu TH02030248 "Využití družicových dat Copernicus pro efektivní monitoring stavu a managementu vybraných rostlinných agrosystémů".</p>
				<p>© <a href="http://gisat.cz" target="_blank">Gisat s.r.o.</a> a <a href="http://www.czechglobe.cz/cs/" target="_blank">Ústav výzkumu globální změny AV ČR v.v.i.</a>, {`${new Date().getFullYear()}`}</p>
			</div>
		</div>
	);
};