export default {
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
		colour: '#fff'
	}
}

export const order = {
	gisatAdmins: [`EVALUATION_CREATED`, `CREATED`, `EVALUATION_APPROVED`, `CLOSED`],
	gisatUsers: [`CREATED`],
	szifAdmins: [`EVALUATION_APPROVED`, [`EVALUATION_CREATED`, `CREATED`], `CLOSED`],
	szifUsers: [`EVALUATION_APPROVED`, [`EVALUATION_CREATED`, `CREATED`], `CLOSED`]
};
