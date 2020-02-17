import React from 'react';
import PropTypes from 'prop-types';
import Icon from "../../../../components/common/atoms/Icon";
import InputText from "../../../../components/common/atoms/Input/Input";
import './style.scss';
import User from "../Login/";
import Button from "../../../../components/common/atoms/Button";

class DromasLpisChangeReviewHeader extends React.PureComponent {

	static propTypes = {
		switchScreenToCaseList: PropTypes.func,
		loadSentinels: PropTypes.func,
		setMapSetView: PropTypes.func,
		getDatesActive: PropTypes.bool,
		mapSet: PropTypes.object,
		getDatesUrl: PropTypes.string,
	};

	constructor(props) {
		super(props);

		this.state = {
			searchString: null,
		};

		this.switchScreen = props.switchScreen.bind(this, 'szifCaseTable');
		this.loadSentinels = this.loadSentinels.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
	}

	onSearchChange(searchString) {
		const {setMapSetView, mapSet} = this.props;
		const coordinatesMatch = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g;
		if(searchString.match(coordinatesMatch)) {
			//set as center
			const lat = searchString.split(',')[0].replace(' ', '');
			const lon = searchString.split(',')[1].replace(' ', '');
			setMapSetView(mapSet.key, [lat, lon], 500);
		}

		this.setState({
			searchString
		});
	}

	loadSentinels() {
		const {loadSentinels, mapSet, getDatesUrl} = this.props;
		loadSentinels(mapSet, getDatesUrl);
	}
	render() {
		const {getDatesActive, switchScreenToCaseList} = this.props;
		const loadSentinelDataTitle = !getDatesActive ? 'Načíst data jde po přiblížení mapy' : 'Načíst sentinel data';
		return (
			<div className="szifLpisZmenovaRizeni-sentinel-explorer-header">
				<div className={'szifLpisZmenovaRizeni-heading'}>
					<div className={'ptr-back-button'}>
						<Button invisible inverted icon="back" onClick={switchScreenToCaseList}/>
					</div>
					<h2>
						Prohlížeč sentinel dat
					</h2>
					<div className="szifLpisZmenovaRizeni-cases-header-tools-container">
						<div className="szifLpisZmenovaRizeni-cases-header-tools">
							<InputText
								placeholder="Souřadnice WGS [48.90, 14.30]"
								transparent
								onChange={this.onSearchChange}
								value={this.state.searchString}
							>
								<Icon icon="search"/>
							</InputText>
							<Button ghost inverted onClick={this.loadSentinels} disabled={!getDatesActive} title={loadSentinelDataTitle}>
								Načíst sentinel data
								<Icon icon="download"/>
							</Button>
						</div>
					</div>
				</div>
				<div className="szifLpisZmenovaRizeni-user">
					<User inverted/>
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;
