export default {
	CREATED: {
		database: `CREATED`,
		gisatName: `Zadáno`,
		szifName: `Zadáno`
	},
	EVALUATION_CREATED: {
		database:  `EVALUATION_CREATED`,
		gisatName: `Vyhodnocení zadáno`,
		szifName: `Zadáno`
	},
	EVALUATION_APPROVED: {
		database:  `EVALUATION_APPROVED`,
		gisatName: `Vyhodnocení schváleno`,
		szifName: `Vyhodnoceno`
	},
	CLOSED: {
		database:  `CLOSED`,
		gisatName: `Uzavřeno`,
		szifName: `Uzavřeno`
	}
}

export const order = {
	gisatAdmins: [`EVALUATION_CREATED`, `CREATED`, `EVALUATION_APPROVED`, `CLOSED`],
	gisatUsers: [`CREATED`],
	szifAdmins: [`EVALUATION_APPROVED`, [`EVALUATION_CREATED`, `CREATED`], `CLOSED`],
	szifUsers: [`EVALUATION_APPROVED`, [`EVALUATION_CREATED`, `CREATED`], `CLOSED`]
};
