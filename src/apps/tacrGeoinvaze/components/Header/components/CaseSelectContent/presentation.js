import React from "react";

import './style.scss';
import classnames from "classnames";
import CaseList from "../CaseList";
import Button from "../../../../../../components/common/atoms/Button";
import Models from "../Models";
import Inputs from "../Inputs";
import About from "../About";

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
						<div>
							<p>
								Tento geoinformační portál je zaměřen na vizualizaci distribuce invazních nepůvodních druhů v rámci ČR. Pro druhy byly vytvořeny mapy současného výskytu a predikční modely možného výskytu. V mapách současného rozšíření je možné též sledovat vývoj šíření druhu podle délky trvání výskytu v zájmovém území. Zobrazení výstupů modelů pak ukazuje maximální možné rozšíření druhů a predikci v časových horizontech.
							</p>
							<p>
								Portál by měl sloužit orgánům státní správy a územní samosprávy, stejně tak soukromým vlastníkům pozemků, honiteb a správcům lesních pozemků. Na základě aktuálního rozšíření či potenciálního nebezpečí rozšíření invazních druhů je možno navrhnout cílené postupy monitoringu a eliminace invazních druhů v zájmovém území, popřípadě žádat o státní finanční příspěvky na likvidaci a management invazních nepůvodních druhů.
							</p>
							<hr/>
							<p>
								Geoinformation portal for biological invasions is constructed for the visualizations of distribution and spreading of alien invasive species (IAS) in the Czech Republic. The outputs are presented in form of quad maps. Presented plant and animal species were selected from the List of Invasive Alien Species of Union Concern (201601141 updated 2017/1263) pursuant the EU Regulation No (1143/2014) of the European Parliament and of the Council, and also form Black list of the CR (Pergl et al. 2016). For selected species were constructed maps of contemporary distribution and predictive models of future spreading. The distribution maps contain several time horizons and is possible to observe species spreading following the species abundances in the area of interest. Model outputs visualization shows the maximal possible spreading of particular species and also short-time predictions.
							</p>
							<p>
								GeoPInS provides a dynamic tool for mapping invasive plant distribution at the landscape level using expert knowledge. Quad maps show where each species currently exists and where it is spreading. Model predictions shows where a species is most likely to be able to spread. The outputs should serve to stakeholders, land managers and regional state administration to plan effectively the strategies and focused management of IAS including the prioritize the IAS populations based on impact, invasiveness and feasibility of control. The outputs of local IAS spreading can also be used us input underlying to plan, fund, and implement invasive species control projects.
							</p>
						</div>
					</div>
					<div className="tacrGeoinvaze-case-select-content-links">
						<div className="tacrGeoinvaze-case-select-content-link-home">
							<Button invisible primary onClick={props.changeContent.bind(null, null)} >Úvod</Button>
						</div>
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
			case "about":
				return React.createElement(About);
			case "inputs":
				return React.createElement(Inputs);
			case "models":
				return React.createElement(Models);
			default:
				return null;
		}
	}
}

export default CaseSelectContent;
