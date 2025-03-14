import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

// Sanity checks
testRule({
	ruleName,
	config: [0],

	accept: [
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-max-class */
				.foo, /* stylelint-disable-next-line selector-max-class */
				.bar,
				/* stylelint-disable-next-line selector-max-class */
				.foo
				{}
			`,
		},
	],

	reject: [
		{
			code: '.foo {}',
			description: 'disallow classes',
			message: messages.expected('.foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
		{
			code: stripIndent`
				/* a comment */
				.foo, /* a comment */
				.bar,
				/* a comment */
				.foo
				{}
			`,
			warnings: [
				{
					message: messages.expected('.foo', 0),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 5,
				},
				{
					message: messages.expected('.bar', 0),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 5,
				},
				{
					message: messages.expected('.foo', 0),
					line: 5,
					column: 1,
					endLine: 5,
					endColumn: 5,
				},
			],
		},
	],
});

// Standard tests
testRule({
	ruleName,
	config: [2],

	accept: [
		{
			code: '.ab {}',
			description: 'fewer than max classes',
		},
		{
			code: '.ab.cd {}',
			description: 'exactly max classes',
		},
		{
			code: '.ab .cd {}',
			description: 'compound selector',
		},
		{
			code: '.ab, \n.cd {}',
			description: 'multiple selectors: fewer than max classes',
		},
		{
			code: '.ab.cd, \n.ef.gh {}',
			description: 'multiple selectors: exactly max classes',
		},
		{
			code: '.ab.cd :not(.ef.gh) {}',
			description: ':not(): inside and outside',
		},
		{
			code: '.ab.cd[disabled]:hover {}',
			description: 'pseudo selectors, attribute selectors',
		},
		{
			code: '.ab { .cd {} }',
			description: 'nested selectors',
		},
		{
			code: '.ab { .cd > & {} }',
			description: 'nested selectors: parent selector',
		},
		{
			code: '.ab, .cd { & > .ef {} }',
			description: 'nested selectors: superfluous parent selector',
		},
		{
			code: '@media print { .ab.cd {} }',
			description: 'media query: parent',
		},
		{
			code: '.ab { @media print { .cd {} } }',
			description: 'media query: nested',
		},
	],

	reject: [
		{
			code: '.ab.cd.ef {}',
			description: 'greater than max classes',
			message: messages.expected('.ab.cd.ef', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '.ab .cd .ef {}',
			description: 'compound selector: greater than max classes',
			message: messages.expected('.ab .cd .ef', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: '.ab, \n.cd.ef.gh {}',
			description: 'multiple selectors: greater than max classes',
			message: messages.expected('.cd.ef.gh', 2),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 10,
		},
		{
			code: ':not(.ab.cd.ef) {}',
			description: ':not(): greater than max classes, inside',
			message: messages.expected(':not(.ab.cd.ef)', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '.ab.cd.ef :not(.gh) {}',
			description: ':not(): greater than max classes, outside',
			message: messages.expected('.ab.cd.ef :not(.gh)', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '.ab { &:hover > .ef.gh {} }',
			description: 'nested selectors: greater than max classes',
			message: messages.expected('&:hover > .ef.gh', 2),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 23,
		},
		{
			code: '.ab { @include test { .ef { &:hover .gh {} } } }',
			description: 'nested selectors: inside at-rule',
			message: messages.expected('&:hover .gh', 2),
			line: 1,
			column: 29,
			endLine: 1,
			endColumn: 40,
		},
	],
});

// SCSS tests
testRule({
	ruleName,
	config: [0],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '.foo #{$test} {}',
			description: 'scss: ignore variable interpolation',
		},
		{
			code: '.foo.bar #{$test} {}',
			description: 'scss: ignore variable interpolation',
		},
	],

	reject: [
		{
			code: '.foo { margin: { left: 0; top: 0; }; }',
			description: 'scss: nested properties',
			message: messages.expected('.foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
		{
			code: '@include test { .foo {} }',
			description: 'scss: mixin @include',
			message: messages.expected('.foo', 0),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 21,
		},
	],
});

// LESS tests
testRule({
	ruleName,
	config: [0],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '.foo @{test} {}',
			description: 'less: ignore variable interpolation',
		},
		{
			code: '.setFont(@size) { font-size: @size; }',
			description: 'less: ignore mixins',
		},
	],

	reject: [
		{
			code: '.foo { .setFont(12px) }',
			description: 'less: ignore called mixins',
			message: messages.expected('.foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
	],
});
