// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const node_path = require('node:path');
const process = require('node:process');
const table = require('table');
const picocolors = require('picocolors');
const stringWidth = require('string-width');
const validateTypes = require('../utils/validateTypes.cjs');
const calcSeverityCounts = require('./calcSeverityCounts.cjs');
const isUnicodeSupported = require('../utils/isUnicodeSupported.cjs');
const pluralize = require('../utils/pluralize.cjs');
const preprocessWarnings = require('./preprocessWarnings.cjs');
const terminalLink = require('./terminalLink.cjs');

const { yellow, dim, underline, blue, red, green } = picocolors;

const NON_ASCII_PATTERN = /\P{ASCII}/u;
const MARGIN_WIDTHS = 9;

/**
 * @param {string} s
 * @returns {string}
 */
function identity(s) {
	return s;
}

const levelColors = {
	info: blue,
	warning: yellow,
	error: red,
	success: identity,
};

const supportsUnicode = isUnicodeSupported();

const symbols = {
	info: blue(supportsUnicode ? 'ℹ' : 'i'),
	warning: yellow(supportsUnicode ? '⚠' : '‼'),
	error: red(supportsUnicode ? '✖' : '×'),
	success: green(supportsUnicode ? '✔' : '√'),
};

/**
 * @param {import('stylelint').LintResult[]} results
 * @returns {string}
 */
function deprecationsFormatter(results) {
	const allDeprecationWarnings = results.flatMap((result) => result.deprecations || []);

	if (allDeprecationWarnings.length === 0) {
		return '';
	}

	const seenText = new Set();
	const lines = [];

	for (const { text, reference } of allDeprecationWarnings) {
		if (seenText.has(text)) continue;

		seenText.add(text);

		let line = ` ${dim('-')} ${text}`;

		if (reference) {
			line += dim(` See: ${underline(reference)}`);
		}

		lines.push(line);
	}

	return ['', yellow('Deprecation warnings:'), ...lines, ''].join('\n');
}

/**
 * @param {import('stylelint').LintResult[]} results
 * @returns {string}
 */
function invalidOptionsFormatter(results) {
	const allInvalidOptionWarnings = results.flatMap((result) =>
		(result.invalidOptionWarnings || []).map((warning) => warning.text),
	);
	const uniqueInvalidOptionWarnings = [...new Set(allInvalidOptionWarnings)];

	return uniqueInvalidOptionWarnings.reduce((output, warning) => {
		output += red('Invalid Option: ');
		output += warning;

		return `${output}\n`;
	}, '\n');
}

/**
 * @param {string} fromValue
 * @param {string} cwd
 * @returns {string}
 */
function logFrom(fromValue, cwd) {
	if (fromValue.startsWith('<')) {
		return underline(fromValue);
	}

	const filePath = node_path.relative(cwd, fromValue).split(node_path.sep).join('/');

	return terminalLink(filePath, `file://${fromValue}`);
}

/**
 * @param {{[k: number]: number}} columnWidths
 * @returns {number}
 */
function getMessageWidth(columnWidths) {
	const width = columnWidths[3];

	validateTypes.assertNumber(width);

	if (!process.stdout.isTTY) {
		return width;
	}

	const availableWidth = process.stdout.columns < 80 ? 80 : process.stdout.columns;
	const fullWidth = Object.values(columnWidths).reduce((a, b) => a + b);

	// If there is no reason to wrap the text, we won't align the last column to the right
	if (availableWidth > fullWidth + MARGIN_WIDTHS) {
		return width;
	}

	return availableWidth - (fullWidth - width + MARGIN_WIDTHS);
}

/**
 * @param {import('stylelint').Warning[]} messages
 * @param {string} source
 * @param {string} cwd
 * @returns {string}
 */
function formatter(messages, source, cwd) {
	if (messages.length === 0) return '';

	/**
	 * Create a list of column widths, needed to calculate
	 * the size of the message column and if needed wrap it.
	 * @type {{[k: string]: number}}
	 */
	const columnWidths = { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1 };

	/**
	 * @param {[string, string, string, string, string]} columns
	 * @returns {[string, string, string, string, string]}
	 */
	function calculateWidths(columns) {
		for (const [key, value] of Object.entries(columns)) {
			const normalisedValue = value ? value.toString() : value;
			const width = columnWidths[key];

			validateTypes.assertNumber(width);
			columnWidths[key] = Math.max(width, stringWidth(normalisedValue));
		}

		return columns;
	}

	let output = '\n';

	if (source) {
		output += `${logFrom(source, cwd)}\n`;
	}

	/**
	 * @param {import('stylelint').Warning} message
	 * @returns {string}
	 */
	function formatMessageText(message) {
		let result = message.text;

		result = result
			// Remove all control characters (newline, tab and etc)
			.replace(/[\u0001-\u001A]+/g, ' ') // eslint-disable-line no-control-regex
			.replace(/\.$/, '');

		const ruleString = ` (${message.rule})`;

		if (result.endsWith(ruleString)) {
			result = result.slice(0, result.lastIndexOf(ruleString));
		}

		return result;
	}

	const cleanedMessages = messages.map((message) => {
		const { line, column, severity } = message;
		/**
		 * @type {[string, string, string, string, string]}
		 */
		const row = [
			line ? line.toString() : '',
			column ? column.toString() : '',
			symbols[severity] ? levelColors[severity](symbols[severity]) : severity,
			formatMessageText(message),
			dim(message.rule || ''),
		];

		calculateWidths(row);

		return row;
	});

	const messageWidth = getMessageWidth(columnWidths);
	const hasNonAsciiChar = messages.some((msg) => NON_ASCII_PATTERN.test(msg.text));

	output += table.table(cleanedMessages, {
		border: table.getBorderCharacters('void'),
		columns: {
			0: { alignment: 'right', width: columnWidths[0], paddingRight: 0, paddingLeft: 2 },
			1: { alignment: 'left', width: columnWidths[1] },
			2: { alignment: 'center', width: columnWidths[2] },
			3: {
				alignment: 'left',
				width: messageWidth,
				wrapWord: messageWidth > 1 && !hasNonAsciiChar,
			},
			4: { alignment: 'left', width: columnWidths[4], paddingRight: 0 },
		},
		drawHorizontalLine: () => false,
	})
		.split('\n')
		.map((el) => el.replace(/(\d+)\s+(\d+)/, (_m, p1, p2) => dim(`${p1}:${p2}`)).trimEnd())
		.join('\n');

	return output;
}

/**
 * @type {import('stylelint').Formatter}
 */
function stringFormatter(results, returnValue) {
	let output = invalidOptionsFormatter(results);

	output += deprecationsFormatter(results);

	const resultCounts = { error: 0, warning: 0 };
	const fixableCounts = { error: 0, warning: 0 };

	output = results.reduce((accum, result) => {
		preprocessWarnings(result);

		accum += formatter(
			result.warnings,
			result.source || '',
			(returnValue && returnValue.cwd) || process.cwd(),
		);

		for (const warning of result.warnings) {
			calcSeverityCounts(warning.severity, resultCounts);
			const fixable = returnValue.ruleMetadata?.[warning.rule]?.fixable;

			if (fixable === true) {
				calcSeverityCounts(warning.severity, fixableCounts);
			}
		}

		return accum;
	}, output);

	// Ensure consistent padding
	output = output.trim();

	if (output !== '') {
		output = `\n${output}\n`;

		const errorCount = resultCounts.error;
		const warningCount = resultCounts.warning;
		const total = errorCount + warningCount;

		if (total > 0) {
			const error = red(`${errorCount} ${pluralize('error', errorCount)}`);
			const warning = yellow(`${warningCount} ${pluralize('warning', warningCount)}`);
			const symbol = errorCount > 0 ? symbols.error : symbols.warning;

			output += `\n${symbol} ${total} ${pluralize('problem', total)} (${error}, ${warning})`;
		}

		const fixErrorCount = fixableCounts.error;
		const fixWarningCount = fixableCounts.warning;

		if (fixErrorCount > 0 || fixWarningCount > 0) {
			let fixErrorText;
			let fixWarningText;

			if (fixErrorCount > 0) {
				fixErrorText = `${fixErrorCount} ${pluralize('error', fixErrorCount)}`;
			}

			if (fixWarningCount > 0) {
				fixWarningText = `${fixWarningCount} ${pluralize('warning', fixWarningCount)}`;
			}

			const countText = [fixErrorText, fixWarningText].filter(Boolean).join(' and ');

			output += `\n  ${countText} potentially fixable with the "--fix" option.`;
		}

		output += '\n\n';
	}

	return output;
}

module.exports = stringFormatter;
