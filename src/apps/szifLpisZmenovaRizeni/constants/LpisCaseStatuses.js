import _ from 'lodash';

const STATUSES = {
	CREATED: {
		database: `CREATED`,
		gisatName: `Zadáno`,
		szifName: `Zadáno`,
		colour: '#ffb312'
	},
	EVALUATION_CREATED: {
		database:  `EVALUATION_CREATED`,
		gisatName: `Vyhodnocení zadáno`,
		szifName: `Zadáno`,
		colour: '#ffb312',
		gisatColour: '#cb0c9b'
	},
	EVALUATION_APPROVED: {
		database:  `EVALUATION_APPROVED`,
		gisatName: `Vyhodnocení schváleno`,
		szifName: `Vyhodnoceno`,
		colour: '#44ae08'
	},
	CLOSED: {
		database:  `CLOSED`,
		gisatName: `Uzavřeno`,
		szifName: `Uzavřeno`,
		colour: '#ffffff'
	},
	INVALID: {
		database:  `INVALID`,
		gisatName: `Neplatné`,
		szifName: `Neplatné`,
		colour: '#ff0000'
	}
};

const getGisatOptionsFromStatuses = function(statuses){
	let options = [];
	_.forIn(statuses, (status) => {
		options.push({
			value: status.database,
			label: status.gisatName,
			keys: [status.database]
		});
	});
	return options;
};

const getGisatUsersOptionsFromStatuses = function(statuses){
	let options = [];
	_.forIn(statuses, (status) => {
		if (status.database === 'CREATED'){
			options.push({
				value: status.database,
				label: status.gisatName,
				keys: [status.database]
			});
		}
	});
	return options;
};

const getSzifOptionsFromStatuses = function(statuses){
	let options = [];
	_.forIn(statuses, (status) => {
		if (status.database !== 'EVALUATION_CREATED'){
			options.push({
				value: status.database,
				label: status.szifName,
				keys: status.database === 'CREATED' ? [status.database, 'EVALUATION_CREATED'] : [status.database]
			});
		}
	});
	return options;
};

export default STATUSES;

export const statusesOptionsGisatUsers = getGisatUsersOptionsFromStatuses(STATUSES);
export const statusesOptionsGisatAdmins = getGisatOptionsFromStatuses(STATUSES);
export const statusesOptionsSzif = getSzifOptionsFromStatuses(STATUSES);

export const order = {
	gisatAdmins: [`EVALUATION_CREATED`, `CREATED`, `EVALUATION_APPROVED`, `CLOSED`],
	gisatUsers: [`CREATED`],
	szifAdmins: [`EVALUATION_APPROVED`, [`EVALUATION_CREATED`, `CREATED`], `CLOSED`],
	szifUsers: [`EVALUATION_APPROVED`, [`EVALUATION_CREATED`, `CREATED`], `CLOSED`],
	szifRegionAdmins: [`EVALUATION_APPROVED`, [`EVALUATION_CREATED`, `CREATED`], `CLOSED`],
};

export const evaluationConclusions = [
	{
		value: 'MATCH',
		label: 'V souladu',
		colour: '#44ae08'
	},
	{
		value: 'MISMATCH',
		label: 'V rozporu',
		colour: '#d02100'
	},
	{
		value: 'UNCLEAR',
		label: 'Nejasné',
		colour: '#d1bd01'
	},
	{
		value: 'INDETERMINABLE',
		label: 'Nelze rozhodnout',
		colour: '#a09a94'
	},
];
