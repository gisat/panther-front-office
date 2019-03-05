import React from 'react';
import classNames from 'classnames';
import {NavLink} from 'react-router-dom';

import Icon from '../../../../components/common/atoms/Icon';
import Metadata from './icons/Metadata';
import AppSelect from '../AppSelect';

import './style.scss';

export default props => (
	<>
		<div className="ptr-bo-top-bar-app-select">
			<AppSelect />
		</div>
		<div className="ptr-bo-top-bar-quick-access">
			<NavLink
				exact
				to={props.appPath + '/'}
			>
				<Icon />
			</NavLink>
			<NavLink
				to={props.appPath + '/metadata'}
			>
				<Icon icon={Metadata}/>
			</NavLink>
			<NavLink
				to={props.appPath + '/test'}
			>
				<Icon />
			</NavLink>
			<NavLink
				to={props.appPath + '/testselect'}
			>
				<Icon />
			</NavLink>
		</div>
	</>
);
