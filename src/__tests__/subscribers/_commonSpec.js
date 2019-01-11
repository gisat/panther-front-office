import common from '../../subscribers/_common';
import _ from 'lodash';

describe('Subscribers common', () => {
	describe('#compareByKey', () => {
		const BY_KEY = {
			1: {
				key: 1,
				data: {
					name: "Prague",
					configuration: {
						a: "a",
						b: "b"
					}
				},
				permissions: {
					guest: {
						update: true,
						delete: true,
						get: true
					}
				}
			},
			2: {
				key: 2,
				data: {
					name: "London",
					configuration: {
						a: "a",
						b: "b"
					}
				},
				permissions: {
					guest: {
						update: false,
						delete: false,
						get: true
					}
				}
			}
		};

		it('should return only added if byKey is null', () => {
			let prev = null;
			let next = _.cloneDeep(BY_KEY);
			let result = common.compareByKey(next, prev);

			expect(result.hasOwnProperty('added')).toBeTruthy();
			expect(result.hasOwnProperty('removed')).toBeFalsy();
			expect(result.hasOwnProperty('changed')).toBeFalsy();
			expect(result.added).toHaveLength(2);
		});

		it('should return 1 added, 1 changed and 1 removed', () => {
			let next = {
				1: {
					key: 1,
					data: {
						name: "Prague",
						configuration: {
							a: "aaa",
							b: "b"
						}
					},
					permissions: {
						guest: {
							update: true,
							delete: true,
							get: true
						}
					}
				},
				3: {
					key: 3,
					data: {
						name: "Paris",
						configuration: {
							a: "a",
							b: "b"
						}
					},
					permissions: {
						guest: {
							update: false,
							delete: false,
							get: true
						}
					}
				}
			};
			let result = common.compareByKey(next, BY_KEY);

			expect(result.hasOwnProperty('added')).toBeTruthy();
			expect(result.hasOwnProperty('removed')).toBeTruthy();
			expect(result.hasOwnProperty('changed')).toBeTruthy();
			expect(result.added).toHaveLength(1);
			expect(result.changed).toHaveLength(1);
			expect(result.removed).toHaveLength(1);
		});
	});
});