import React from "react";

import LandingPage from '../LandingPage';

export default props => props.activeScopeKey ? (<div>App</div>) : (<LandingPage/>);