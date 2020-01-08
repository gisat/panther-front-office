import _ from 'lodash';

const MAX_SIZE = 100;

class CacheFifo {
	constructor(maxSize) {
		this.data = [];

		this.maxSize = maxSize || MAX_SIZE;
	}

	add(record) {
		this.data.push(record);

		if (this.size() > this.maxSize) {
			this.remove();
		}
	}

	remove() {
		this.data.shift();
	}

	addOrUpdate(record) {
		let existingRecordIndex = this.findIndexByKey(record.cacheKey);

		if (existingRecordIndex !== -1) {
			this.data[existingRecordIndex] = record;
		} else {
			this.add(record);
		}
	}

	first() {
		return this.data[0];
	}

	last() {
		return this.data[this.data.length - 1];
	}

	size() {
		return this.data.length;
	}

	findIndexByKey(cacheKey) {
		return _.findIndex(this.data, {cacheKey});
	}

	findByKey(cacheKey) {
		return _.find(this.data, {cacheKey});
	}
}

export default CacheFifo;