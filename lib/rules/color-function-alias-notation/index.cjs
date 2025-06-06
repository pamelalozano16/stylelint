// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const valueParser = require('postcss-value-parser');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const getDeclarationValue = require('../../utils/getDeclarationValue.cjs');
const isStandardSyntaxColorFunction = require('../../utils/isStandardSyntaxColorFunction.cjs');
const typeGuards = require('../../utils/typeGuards.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const setDeclarationValue = require('../../utils/setDeclarationValue.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'color-function-alias-notation';

const messages = ruleMessages(ruleName, {
	expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/color-function-alias-notation',
	fixable: true,
};

const WITH_A_FUNCTION_CALL = /\b(?:rgba|hsla)\(/i;
const WITHOUT_A_FUNCTION_CALL = /\b(?:rgb|hsl)\(/i;
const WITH_A_FUNCTION_NAME = /^(?:rgba|hsla)$/i;
const WITHOUT_A_FUNCTION_NAME = /^(?:rgb|hsl)$/i;

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['with-alpha', 'without-alpha'],
		});

		if (!validOptions) return;

		const targetFunctionCall =
			primary === 'with-alpha' ? WITHOUT_A_FUNCTION_CALL : WITH_A_FUNCTION_CALL;
		const targetFunctionName =
			primary === 'with-alpha' ? WITHOUT_A_FUNCTION_NAME : WITH_A_FUNCTION_NAME;

		root.walkDecls((decl) => {
			if (!targetFunctionCall.test(decl.value)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				if (!typeGuards.isValueFunction(node) || !isStandardSyntaxColorFunction(node)) return;

				const { value, sourceIndex } = node;

				if (!targetFunctionName.test(value)) return;

				const fixed = primary === 'with-alpha' ? `${value}a` : value.slice(0, -1);
				const fix = () => {
					node.value = fixed;
					setDeclarationValue(decl, parsedValue.toString());
				};

				const index = nodeFieldIndices.declarationValueIndex(decl) + sourceIndex;
				const endIndex = index + value.length;

				report({
					message: messages.expected,
					messageArgs: [value, fixed],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
					fix: {
						apply: fix,
						node: decl,
					},
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
