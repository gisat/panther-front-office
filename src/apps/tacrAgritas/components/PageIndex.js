import React from "react";
import {NavLink} from "react-router-dom";
import Helmet from "react-helmet";
import Fade from "react-reveal/Fade";

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
				<div className="tacrAgritas-index-cards">
					{places.map(place =>
						<NavLink
							key={place.key}
							to={"/" + place.key}
							className={`tacrAgritas-index-card ${place.key} ${place.data.bbox ? null : "disabled"}`}
						>
							<div className="tacrAgritas-index-card-content">
								<div className="tacrAgritas-index-card-title">{place.data.nameDisplay}</div>
								<div className="tacrAgritas-index-card-subtitle">{place.data.description}</div>
							</div>
						</NavLink>
					)}
				</div>
			</div>
		</div>
	);
};