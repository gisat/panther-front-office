import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

import ShareButton from '../../../common/controls/Share/Button';
import User from '../../../common/controls/User';
import Button from "../../../presentation/atoms/Button";
import Loader from "../../../presentation/atoms/Loader/Loader";
import CheckButton from "./CheckButton";

class LpisCheckHeader extends React.PureComponent {

	static propTypes = {
		case: PropTypes.object,
		caseVisited: PropTypes.func,
		caseConfirmed: PropTypes.func,
		showCase: PropTypes.func,
		nextCaseKey: PropTypes.number,
		previousCaseKey: PropTypes.number,
		map: PropTypes.object,
		onMount: PropTypes.func,
		changingCase: PropTypes.bool,
	};

	constructor(props) {
		super(props);
		this.geometryInitialized = false;
		this.goToPreviousCase = this.goToPreviousCase.bind(this);
		this.goToNextCase = this.goToNextCase.bind(this);
	}

	componentWillReceiveProps() {
		if(!this.geometryInitialized && this.props.map) {
			this.geometryInitialized = true;
			this.props.onMount(this.props.map.key, this.props.case.data.geometry);
		}
	}
	componentDidMount() {
		//set Case as visited
		this.props.caseVisited(this.props.case.key, true);
	}

	goToPreviousCase() {
		this.props.showCase(this.props.previousCaseKey);
	}

	goToNextCase() {
		this.props.showCase(this.props.nextCaseKey);
	}

	render() {
		const visited = this.props.case && this.props.case.data.visited || false;
		const confirmed = this.props.case && this.props.case.data.confirmed || false;

		const infoAreaStyle = {
			flexDirection: 'column',
			alignItems: 'flex-start',
			justifyContent: 'center',
			margin: '10px'
		}

		const loginContainerStyle = {margin: '20px 8px'};
		return (
			<div id="lpisCheckHeader">
				{
					this.props.changingCase ? <Loader transparent /> :
				<div className="container flex">
					<div className="container flex">
						<div className="container flex center" style={{flexFlow: 'row-reverse'}}>
						{
							this.props.previousCaseKey ? (
							<Button inverted className="header-button component-button ptr-button-fit" onClick={this.goToPreviousCase}>
								<i className="fa fa-chevron-left" aria-hidden="true"></i>
								Předchozí
							</Button>) : null
						}
						</div>
						<div className="container flex columns center" style={{alignItems: 'center'}}>
							<div className="container flex center" style={infoAreaStyle}>
								
								 {this.props.case.data.stav ? (<div>
									<label>
										<span>Stav: </span>
										{this.props.case.data.stav}
									</label>
								</div>) : null}
								<div>
									<label>
										<span>Kód: </span>
										{this.props.case.data.nkod_dpb}
									</label>
								</div>
								<div>
									<label>
										<span>Kultura: </span>
										{this.props.case.data.kulturakod}
									</label>
								</div>
								{
									this.props.case.data.typ ? (
									<div>
										<label>
											<span>Typ plochy: </span>
											{this.props.case.data.typ}
										</label>
									</div>) : null
								}
								{
									this.props.case.data.poznamka ? (
									<div>
										<label>
											<span>Poznámka: </span>
											{this.props.case.data.poznamka}
										</label>
									</div>) : null
								}
							</div>
							<div className="container flex center">
								{/* <CheckButton title='Prohlédnuto' onClick={(e)=>{
									e.preventDefault();
									this.props.caseVisited(this.props.case.key, !visited);
								}} checked={visited}/>
								<CheckButton title='Schváleno' onClick={(e)=>{
									e.preventDefault();
									this.props.caseConfirmed(this.props.case.key, !confirmed);
								}} checked={confirmed}/> */}
							</div>
						</div>
						<div className="container flex center">
							{
								this.props.nextCaseKey ? (
									<Button inverted className="header-button component-button ptr-button-fit" onClick={this.goToNextCase}>
										Následující
										<i className="fa fa-chevron-right" aria-hidden="true"></i>
									</Button>
								) : null
							}
						</div>
					</div>
					<div className="container flex" style={{maxWidth: '200px', justifyContent: 'flex-end'}}>
						<div style={loginContainerStyle}>
							<User />
						</div>
					</div>
				</div>
				}
			</div>
		);
	}

}

export default LpisCheckHeader;
