import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

// Sanity checks
testRule({
	ruleName,
	config: [0],

	accept: [
		{
			code: 'foo {}',
		},
		{
			code: '.bar {}',
		},
		{
			code: 'foo .bar {}',
		},
		{
			code: '[foo] {}',
		},
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
				/* stylelint-disable-next-line selector-max-id */
				#foo, /* stylelint-disable-next-line selector-max-id */
				#bar,
				/* stylelint-disable-next-line selector-max-id */
				#baz
				{}
			`,
		},
	],

	reject: [
		{
			code: '#foo {}',
			message: messages.expected('#foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
		{
			code: '.bar #foo {}',
			message: messages.expected('.bar #foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '.bar > #foo {}',
			message: messages.expected('.bar > #foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: '#foo.bar {}',
			message: messages.expected('#foo.bar', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: '.foo, .bar, #foo.baz {}',
			message: messages.expected('#foo.baz', 0),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '#foo [lang^=en] {}',
			message: messages.expected('#foo [lang^=en]', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '#foo[lang^=en] {}',
			message: messages.expected('#foo[lang^=en]', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '* #foo {}',
			message: messages.expected('* #foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '#foo * {}',
			message: messages.expected('#foo *', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '*#foo {}',
			message: messages.expected('*#foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: '#foo:hover {}',
			message: messages.expected('#foo:hover', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: ':not(#foo) {}',
			message: messages.expected(':not(#foo)', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: stripIndent`
				/* a comment */
				#foo, /* a comment */
				#bar,
				/* a comment */
				#foo
				{}
			`,
			warnings: [
				{
					message: messages.expected('#foo', 0),
					line: 2,
					column: 1,
					endLine: 2,
					endColumn: 5,
				},
				{
					message: messages.expected('#bar', 0),
					line: 3,
					column: 1,
					endLine: 3,
					endColumn: 5,
				},
				{
					message: messages.expected('#foo', 0),
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
			code: '#foo {}',
			description: 'fewer than max ID selectors',
		},
		{
			code: '#foo:hover {}',
			description: 'pseudo selectors',
		},
		{
			code: '#foo #bar {}',
			description: 'compound selector',
		},
		{
			code: '#foo, \n#bar {}',
			description: 'multiple selectors: fewer than max ID selectors',
		},
		{
			code: '#foo #bar, \n#bar #foo {}',
			description: 'multiple selectors: exactly max ID selectors',
		},
		{
			code: '#foo #bar:not(#baz) {}',
			description: ':not(): outside and inside',
		},
		{
			code: '#foo { #bar {} }',
			description: 'nested selectors',
		},
		{
			code: '#foo { #bar > & {} }',
			description: 'nested selectors: parent selector',
		},
		{
			code: '#foo, #bar { & > #foo {} }',
			description: 'nested selectors: superfluous parent selector',
		},
		{
			code: '@media print { #foo #bar {} }',
			description: 'media query: parent',
		},
		{
			code: '#foo { @media print { #bar {} } }',
			description: 'media query: nested',
		},
		{
			code: '.foo { @media print { #bar #baz {} } }',
			description: '@media query: nested compound selector',
		},
		{
			code: '#foo { #baz { .quux {} } }',
			description: 'nested compound selector',
		},
		{
			code: '#foo { .baz { #quux {} } }',
			description: 'nested compound selector',
		},
		{
			code: ':--foo(#foo) #bar #baz {}',
			description: 'custom functional pseudo',
		},
	],

	reject: [
		{
			code: '#foo #bar #baz {}',
			description: 'compound selector: greater than max ID selectors',
			message: messages.expected('#foo #bar #baz', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '#foo, \n#bar #baz #foo {}',
			description: 'multiple selectors: greater than max ID selectors',
			message: messages.expected('#bar #baz #foo', 2),
			line: 2,
			column: 1,
			endLine: 2,
			endColumn: 15,
		},
		{
			code: '#foo #bar #baz:not(#quux) {}',
			description: ':not(): greater than max ID selectors, outside',
			message: messages.expected('#foo #bar #baz:not(#quux)', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 26,
		},
		{
			code: '#foo { &:hover > #bar #baz {} }',
			description: 'nested selectors: greater than max ID selectors',
			message: messages.expected('&:hover > #bar #baz', 2),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 27,
		},
		{
			code: '#foo #bar #baz { @media print { #bar {} } }',
			description: 'compound selector: greater than max ID selectors, nested @media query',
			warnings: [
				{
					message: messages.expected('#foo #bar #baz', 2),
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 15,
				},
				{
					message: messages.expected('#bar', 2),
					line: 1,
					column: 33,
					endLine: 1,
					endColumn: 37,
				},
			],
		},
		{
			code: '.foo { @media print { #bar #baz #foo {} } }',
			description: 'nested compound selector: greater than max ID selectors, nested @media query',
			message: messages.expected('#bar #baz #foo', 2),
			line: 1,
			column: 23,
			endLine: 1,
			endColumn: 37,
		},
		{
			code: '#foo #bar { #baz { #quux {} } }',
			description: 'nested compound selector: greater than max ID selectors',
			warnings: [
				{
					message: messages.expected('#baz', 2),
					line: 1,
					column: 13,
					endLine: 1,
					endColumn: 17,
				},
				{
					message: messages.expected('#quux', 2),
					line: 1,
					column: 20,
					endLine: 1,
					endColumn: 25,
				},
			],
		},
		{
			code: '#foo { #baz { #quux {} } }',
			description: 'nested compound selector: greater than max ID selectors',
			message: messages.expected('#quux', 2),
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 20,
		},
	],
});

testRule({
	ruleName,
	config: [
		0,
		{
			checkContextFunctionalPseudoClasses: [':--foo'],
		},
	],

	accept: [
		{
			code: ':--bar(#foo) {}',
		},
	],

	reject: [
		{
			code: ':--foo(#foo) {}',
			description: 'custom pseudo-class selector: greater than max ID selectors',
			message: messages.expected(':--foo(#foo)', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 13,
		},
		{
			code: ':--foo(#foo #bar #baz) {}',
			description: 'custom pseudo-class selector: greater than max ID selectors',
			message: messages.expected(':--foo(#foo #bar #baz)', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 23,
		},
	],
});

testRule({
	ruleName,
	config: [
		2,
		{
			ignoreContextFunctionalPseudoClasses: [':not'],
			checkContextFunctionalPseudoClasses: [':not'],
		},
	],

	reject: [
		{
			code: 'a:not(#foo #bar #baz) {}',
			message: messages.expected('a:not(#foo #bar #baz)', 2),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 22,
		},
	],
});

testRule({
	ruleName,
	config: [0],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '@keyframes spin { #{50% - $n} {} }',
		},
		{
			code: '@for $n from 1 through 10 { .n-#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore sass interpolation inside @for',
		},
		{
			code: '@for $n from 1 through 10 { .n#{$n}-#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore multiple sass interpolations in a selector inside @for',
		},
		{
			code: '@for $n from 1 through 10 { .n#{$n}n#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore multiple sass interpolations in a selector inside @for',
		},
		{
			code: '@each $n in $vals { .n-#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore sass interpolation inside @each',
		},
		{
			code: '@while $n < 10 { .n-#{$n} { content: "n: #{1 + 1}"; } }',
			description: 'ignore sass interpolation inside @while',
		},
		{
			code: 'div:nth-child(#{map-get($foo, bar)}) {}',
			description: 'ignore sass map-get interpolation',
		},
		{
			code: '@for $n from 1 through 10 { .n-#{$n} #foo {} }',
			description: 'ignore sass interpolation + ID inside @for',
		},
	],

	reject: [
		{
			code: '#foo { @include test {} }',
			message: messages.expected('#foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 5,
		},
		{
			code: '.bar #foo { @include test {} }',
			message: messages.expected('.bar #foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '.bar > #foo { @include test {} }',
			message: messages.expected('.bar > #foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: '#foo.bar { @include test {} }',
			message: messages.expected('#foo.bar', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: '.foo, .bar, #foo.baz { @include test {} }',
			message: messages.expected('#foo.baz', 0),
			line: 1,
			column: 13,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: '#foo [lang^=en] { @include test {} }',
			message: messages.expected('#foo [lang^=en]', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
		{
			code: '#foo[lang^=en] { @include test {} }',
			message: messages.expected('#foo[lang^=en]', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 15,
		},
		{
			code: '* #foo { @include test {} }',
			message: messages.expected('* #foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '#foo * { @include test {} }',
			message: messages.expected('#foo *', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 7,
		},
		{
			code: '*#foo { @include test {} }',
			message: messages.expected('*#foo', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 6,
		},
		{
			code: '#foo:hover { @include test {} }',
			message: messages.expected('#foo:hover', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: ':not(#foo) { @include test {} }',
			message: messages.expected(':not(#foo)', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 11,
		},
		{
			code: '@include test { #foo {} }',
			message: messages.expected('#foo', 0),
			line: 1,
			column: 17,
			endLine: 1,
			endColumn: 21,
		},
	],
});

testRule({
	ruleName,
	config: [0],
	customSyntax: 'postcss-less',

	accept: [
		{
			code: '.for(@n: 1) when (@n <= 10) { .n-@{n} { content: %("n: %d", 1 + 1); } .for(@n + 1); }',
			description: 'ignore Less interpolation inside .for',
		},
		{
			code: '.for(@n: 1) when (@n <= 10) { .n-@{n}-@{n} { content: %("n: %d", 1 + 1); } .for(@n + 1); }',
			description: 'ignore multiple Less interpolations in a selector inside .for',
		},
		{
			code: '.for(@n: 1) when (@n <= 10) { .n-@{n}n@{n} { content: %("n: %d", 1 + 1); } .for(@n + 1); }',
			description: 'ignore multiple Less interpolations in a selector inside .for',
		},
		{
			code: '.each(@vals, @n: 1) when (@n <= length(@vals)) { @val: extract(@vals, @n); .n-@{val} { content: %("n: %d", 1 + 1); } .each(@vals, @n + 1); }',
			description: 'ignore Less interpolation inside .each',
		},
		{
			code: '.while(@n: 0) when (@n < 10) { .n-@{n} { content: %("n: %d", 1 + 1); } .while(@n + 1) }',
			description: 'ignore Less interpolation inside .while',
		},
		{
			code: '.for(@n: 1) when (@n <= 10) { .n-@{n} #foo {} .for(@n + 1) }',
			description: 'ignore Less interpolation + ID inside .for',
		},
	],
});

testRule({
	ruleName,
	config: [2],
	customSyntax: 'postcss-scss',

	accept: [
		{
			code: '#foo { @if ($p == 1) { #bar {} } }',
			description: '@if statement: nested',
		},
		{
			code: '.foo { @if ($p == 1) { #bar #baz {} } }',
			description: '@if statement: nested compound selector',
		},
	],

	reject: [
		{
			code: '#foo #bar #baz { @if ($p == 1) { #bar {} } }',
			description: 'compound selector: greater than max ID selectors, nested @if statement',
			warnings: [
				{
					message: messages.expected('#foo #bar #baz', 2),
					line: 1,
					column: 1,
					endLine: 1,
					endColumn: 15,
				},
				{
					message: messages.expected('#bar', 2),
					line: 1,
					column: 34,
					endLine: 1,
					endColumn: 38,
				},
			],
		},
		{
			code: '.foo { @if ($p == 1) { #bar #baz #foo {} } }',
			description: 'nested compound selector: greater than max ID selectors, nested @if statement',
			message: messages.expected('#bar #baz #foo', 2),
			line: 1,
			column: 24,
			endLine: 1,
			endColumn: 38,
		},
	],
});

testRule({
	ruleName,
	config: [0, { ignoreContextFunctionalPseudoClasses: [':not', /^:(h|H)as$/] }],

	accept: [
		{
			code: 'a:not(#foo) {}',
			description: 'selector within ignored pseudo-class (string input)',
		},
		{
			code: 'a:has(#foo) {}',
			description: 'selector within ignored pseudo-class (regex input)',
		},
	],
	reject: [
		{
			code: 'a:matches(#foo) {}',
			description: 'selector within non-ignored pseudo class',
			message: messages.expected('a:matches(#foo)', 0),
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 16,
		},
	],
});
