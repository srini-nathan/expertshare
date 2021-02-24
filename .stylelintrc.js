module.exports = {
    extends: [
        "stylelint-prettier/recommended",
        "stylelint-config-sass-guidelines"
    ],
    rules: {
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "tailwind",
                    "apply",
                    "responsive",
                    "variants",
                    "screen",
                    "mixin",
                    "each"
                ],
            },
        ],
        "color-no-invalid-hex": true,
        indentation: 4,
        "max-empty-lines": 2,
        "declaration-colon-space-after": "always",
        "no-eol-whitespace": null,
        "value-list-comma-newline-after": null,
        "declaration-colon-newline-after": null,
        "string-quotes": "double",
        "max-nesting-depth": 3,
        "selector-no-qualifying-type": [
            true,
            {
                "ignore": ["attribute"]
            }
        ]
    },
};
