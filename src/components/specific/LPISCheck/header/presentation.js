import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

import ShareButton from '../../../common/controls/Share/Button';
import User from '../../../common/controls/User';
import Button from "../../../presentation/atoms/Button";
import CheckButton from "./CheckButton";

class LpisCheckHeader extends React.PureComponent {

	static propTypes = {
		case: PropTypes.object,
		caseVisited: PropTypes.func,
		caseConfirmed: PropTypes.func,
		showCase: PropTypes.func,
		nextCaseKey: PropTypes.number,
		previousCaseKey: PropTypes.number,
	};

	constructor(props) {
		super(props);

		this.goToPreviousCase = this.goToPreviousCase.bind(this);
		this.goToNextCase = this.goToNextCase.bind(this);
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
		// TODO - poznamka + nkod_dpb + kulturakod + typ?
		const visited = this.props.case && this.props.case.data.visited || false;
		const confirmed = this.props.case && this.props.case.data.confirmed || false;
		return (
			<div id="lpisCheckHeader">
				<div className="container flex">
					<div className="container flex">
						<div className="container flex center" style={{flexFlow: 'row-reverse'}}>
						{
							this.props.previousCaseKey ? (
							<Button inverted className="component-button" onClick={this.goToPreviousCase}>
								<i className="fa fa-chevron-left" aria-hidden="true"></i>
								Předchozí
							</Button>) : null
						}
						</div>
						<div className="container flex columns center" style={{alignItems: 'center'}}>
							<div className="container flex center">
								<CheckButton title='Prohlídnuto' onClick={(e)=>{
									e.preventDefault();
									this.props.caseVisited(this.props.case.key, !visited);
								}} checked={visited}/>
								<CheckButton title='Schváleno' onClick={(e)=>{
									e.preventDefault();
									this.props.caseConfirmed(this.props.case.key, !confirmed);
								}} checked={confirmed}/>
							</div>
						</div>
						<div className="container flex center">
							{
								this.props.nextCaseKey ? (
									<Button inverted className="component-button" onClick={this.goToNextCase}>
										Následující
										<i className="fa fa-chevron-right" aria-hidden="true"></i>
									</Button>
								) : null
							}
						</div>
					</div>
					<div className="container flex" style={{maxWidth: '200px'}}>
						<User />
						<ShareButton>
						</ShareButton>
					</div>
				</div>
			</div>
		);
	}

}

export default LpisCheckHeader;
