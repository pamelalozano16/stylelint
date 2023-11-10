// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

/**
 * Unite two or more sets
 *
 * @param {Iterable<string>[]} args
 */
function uniteSets(...args) {
	return new Set([...args].reduce((result, set) => [...result, ...set], []));
}

module.exports = uniteSets;