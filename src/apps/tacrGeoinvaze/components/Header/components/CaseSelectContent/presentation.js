import React from "react";

import './style.scss';
import classnames from "classnames";
import CaseList from "../CaseList";
import Button from "../../../../../../components/common/atoms/Button";
import Models from "../Models";

class CaseSelectContent extends React.PureComponent {

	render() {
		const props = this.props;

		let classes = classnames("tacrGeoinvaze-case-select-content", {
			showIntro: props.introVisible && !props.content
		});

		return (

			<div className={classes}>
				<div className="tacrGeoinvaze-case-select-content-info">
					<div className="tacrGeoinvaze-case-select-content-intro">
					<p>
						Tento geoinformační portál je zaměřen na vizualizaci distribuce invazních nepůvodních druhů v rámci ČR. Pro druhy byly vytvořeny mapy současného výskytu a predikční modely možného výskytu. V mapách současného rozšíření je možné též sledovat vývoj šíření druhu podle délky trvání výskytu v zájmovém území. Zobrazení výstupů modelů pak ukazuje maximální možné rozšíření druhů a predikci v časových horizontech.
					</p>
					<p>
						Portál by měl sloužit orgánům státní správy a územní samosprávy, stejně tak soukromým vlastníkům pozemků, honiteb a správcům lesních pozemků. Na základě aktuálního rozšíření či potenciálního nebezpečí rozšíření invazních druhů je možno navrhnout cílené postupy monitoringu a eliminace invazních druhů v zájmovém území, popřípadě žádat o státní finanční příspěvky na likvidaci a management invazních nepůvodních druhů.
					</p>
					</div>
					<div className="tacrGeoinvaze-case-select-content-links">
						<Button invisible primary onClick={props.changeContent.bind(null, null)}>Úvod</Button>
						<Button invisible primary onClick={props.changeContent.bind(null, 'about')}>O projektu</Button>
						<Button invisible primary onClick={props.changeContent.bind(null, 'inputs')}>Vstupní data</Button>
						<Button invisible primary onClick={props.changeContent.bind(null, 'models')}>Použité modely</Button>
					</div>
					<div className="tacrGeoinvaze-case-select-content-content">
						{this.renderContent(props.content)}
					</div>
				</div>
				<div className="tacrGeoinvaze-case-select-content-cases">
					<div className="tacrGeoinvaze-case-select-terrestrialAnimals">
						<div>Suchozemští živočichové</div>
						{props.categories && props.categories.terrestrialAnimals ? (
							<CaseList
								categoryKey={props.categories.terrestrialAnimals}
							/>
						) : null}
					</div>
					<div className="tacrGeoinvaze-case-select-terrestrialPlants">
						<div>Suchozemské rostliny</div>
						{props.categories && props.categories.terrestrialPlants ? (
							<CaseList
								categoryKey={props.categories.terrestrialPlants}
							/>
						) : null}
					</div>
					<div className="tacrGeoinvaze-case-select-aquaticAnimals">
						<div>Vodní živočichové</div>
						{props.categories && props.categories.aquaticAnimals ? (
							<CaseList
								categoryKey={props.categories.aquaticAnimals}
							/>
						) : null}
					</div>
					<div className="tacrGeoinvaze-case-select-aquaticPlants">
						<div>Vodní rostliny</div>
						{props.categories && props.categories.aquaticPlants ? (
							<CaseList
								categoryKey={props.categories.aquaticPlants}
							/>
						) : null}
					</div>
				</div>
			</div>

		);
	}
	
	renderContent(key) {
		switch(key) {
			case "models":
				return React.createElement(Models);
			default:
				return null;
		}
	}
}

export default CaseSelectContent;
