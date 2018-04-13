import React from 'react';
import { connect } from 'react-redux';
import Select from '../state/Select';
import DataUploadOverlay from '../components/containers/overlays/DataUploadOverlay';

const MagicSwitch = () => {
	return <DataUploadOverlay />;
};

export default MagicSwitch;
