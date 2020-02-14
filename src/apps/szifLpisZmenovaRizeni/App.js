import React from 'react';
import { connect } from 'react-redux';
import Select from './state/Select';
import SzifCaseList from "./components/SzifCaseList";
import SzifMapViewWrapper from "./components/SzifMapViewWrapper";
import SzifSentinelExplorer from "./components/SzifSentinelExplorer";
import ScreenAnimator from "../../components/common/ScreenAnimator";

const mapStateToProps = state => {
	const userGroups = Select.specific.lpisZmenovaRizeni.getActiveUserGroups(state);

	return {
		userGroups,
	}
};

const mapDispatchToPropsFactory = () => {
};

const presentation = ({userGroups}) => {
    if(userGroups && userGroups.length > 0) {
        return (<ScreenAnimator
            screenAnimatorKey='szifScreenAnimator'
            activeScreenKey='szifCaseList'
            >
            <SzifCaseList screenKey="szifCaseList"/>
            <SzifMapViewWrapper screenKey="szifMapView"/>
            <SzifSentinelExplorer screenKey="szifSentinelExplorer"/>
        </ScreenAnimator>)
    } else {
        return null
    }
}

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);