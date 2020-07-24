export const REGEXES = {
    DESIGN_PROPERTY: "^[a-zA-Z.]+$",
    CLASS_NAME_NATIVE: "^[a-zA-Z]+$",
    CLASS_NAME_WEB: "^[a-z-_]+$",
};

export interface ValidatorRule {
    rule: string;
    regExp: RegExp;
    error: string;
}

const createRule = (regExString: string, error: string): ValidatorRule => {
    return {
        rule: `matchRegexp:${regExString}`,
        regExp: new RegExp(regExString),
        error,
    };
};

export const DESIGN_PROPERTY_RULE = createRule(
    REGEXES.DESIGN_PROPERTY,
    "Design Property Elements can only consist of letters and dots (.)",
);

export const CLASS_NAME_NATIVE_RULE = createRule(
    REGEXES.CLASS_NAME_NATIVE,
    "Native classes can only be written as pascalCase (e.g. 'myAwesomeVariation')",
);

export const CLASS_NAME_WEB_RULE = createRule(
    REGEXES.CLASS_NAME_WEB,
    "Web classes should only use lowercase letters and hyphens (e.g. 'spacing-outer-bottom')",
);
