// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const isPlainObject$1 = require('is-plain-object');

/** @import { Range, Position } from 'stylelint' */

/**
 * Checks if the value is a boolean or a Boolean object.
 * @param {unknown} value
 * @returns {value is boolean}
 */
function isBoolean(value) {
	return typeof value === 'boolean' || value instanceof Boolean;
}

/**
 * Checks if the value is a function or a Function object.
 * @param {unknown} value
 * @returns {value is Function}
 */
function isFunction(value) {
	return typeof value === 'function' || value instanceof Function;
}

/**
 * Checks if the value is *nullish*.
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Nullish
 * @param {unknown} value
 * @returns {value is null | undefined}
 */
function isNullish(value) {
	return value == null;
}

/**
 * Checks if the value is a number or a Number object.
 * @param {unknown} value
 * @returns {value is number}
 */
function isNumber(value) {
	return typeof value === 'number' || value instanceof Number;
}

/**
 * Checks if the value is an object.
 * @param {unknown} value
 * @returns {value is object}
 */
function isObject(value) {
	return value !== null && typeof value === 'object';
}

/**
 * Checks if the value is a regular expression.
 * @param {unknown} value
 * @returns {value is RegExp}
 */
function isRegExp(value) {
	return value instanceof RegExp;
}

/**
 * Checks if the value is a string or a String object.
 * @param {unknown} value
 * @returns {value is string}
 */
function isString(value) {
	return typeof value === 'string' || value instanceof String;
}

/**
 * Checks if the value is a plain object.
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isPlainObject(value) {
	return isPlainObject$1.isPlainObject(value);
}

/**
 * Assert that the value is truthy.
 * @param {unknown} value
 * @param {string} [message]
 * @returns {asserts value}
 */
function assert(value, message = undefined) {
	if (message) {
		// eslint-disable-next-line no-console
		console.assert(value, message);
	} else {
		// eslint-disable-next-line no-console
		console.assert(value);
	}
}

/**
 * Assert that the value is a function or a Function object.
 * @param {unknown} value
 * @returns {asserts value is Function}
 */
function assertFunction(value) {
	// eslint-disable-next-line no-console
	console.assert(isFunction(value), `"${value}" must be a function`);
}

/**
 * Assert that the value is a number or a Number object.
 * @param {unknown} value
 * @returns {asserts value is number}
 */
function assertNumber(value) {
	// eslint-disable-next-line no-console
	console.assert(isNumber(value), `"${value}" must be a number`);
}

/**
 * Assert that the value is a string or a String object.
 * @param {unknown} value
 * @returns {asserts value is string}
 */
function assertString(value) {
	// eslint-disable-next-line no-console
	console.assert(isString(value), `"${value}" must be a string`);
}

/**
 * @param {unknown} value
 * @returns {value is Position}
 */
function isPosition(value) {
	if (!isPlainObject(value)) return false;

	if (!isNumber(value.line)) return false;

	if (!isNumber(value.column)) return false;

	return true;
}

/**
 * @param {unknown} value
 * @returns {value is Range}
 */
function isRange(value) {
	if (!isPlainObject(value)) return false;

	if (!isPosition(value.start)) return false;

	if (!isPosition(value.end)) return false;

	return true;
}

exports.assert = assert;
exports.assertFunction = assertFunction;
exports.assertNumber = assertNumber;
exports.assertString = assertString;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isNullish = isNullish;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isPosition = isPosition;
exports.isRange = isRange;
exports.isRegExp = isRegExp;
exports.isString = isString;
