module.exports = {
    extends: [
        "stylelint-config-twbs-bootstrap/scss"
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
        "selector-max-compound-selectors": 5,
        "max-nesting-depth": 5,
        "selector-no-qualifying-type": [
            true,
            {
                "ignore": ["attribute"]
            }
        ],
        "color-hex-case": "upper",
    },
};
