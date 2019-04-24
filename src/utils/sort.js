import _ from 'lodash';

const CHAR_MAP_LOWERCASE = " 0123456789aábcčdďeéěfghiíjklmnňoópqrřsštťuúůvwxyýzž";
const CHAR_MAP_UPPERCASE = " 0123456789AÁBCČDĎEÉĚFGHIÍJKLMNŇOÓPQRŘSŠTŤUÚŮVWXYÝZŽ";

let charsOrder = {};
for(let i in CHAR_MAP_LOWERCASE.split('')) {
	charsOrder[CHAR_MAP_LOWERCASE[i]] = parseInt(i);
	charsOrder[CHAR_MAP_UPPERCASE[i]] = parseInt(i);
}

// TODO solve 'ch' character and test
function czAlphabeticalSort(path, prev, next) {
	if (path) {
		prev = _.get(prev, path);
		next = _.get(next, path);
	}

	let idx = 0;
	while ( (idx < prev.length) && (idx < next.length) && (charsOrder[prev[idx]] === charsOrder[next[idx]])) {
		idx ++;
	}
	if (idx === prev.length) return 1;
	if (idx === next.length) return -1;
	return charsOrder[prev[idx]] > charsOrder[next[idx]] ? 1 : (charsOrder[prev[idx]] < charsOrder[next[idx]] ? -1 : 0);
}

function sortByOrder (data, order) {
	let keys = order.map(rule => rule[0]);
	let orders = order.map(rule => rule[1]);
	return _.orderBy(data, keys, orders);
}

export default {
	czAlphabeticalSort,
	sortByOrder
};