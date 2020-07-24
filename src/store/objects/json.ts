import {
    DropdownDesignProperty,
    ToggleDesignProperty,
    ToggleDesignPropertyReturn,
    DropdownDesignPropertyReturn,
} from "./design-property";
interface JSONProperty {
    name?: string;
    oldNames?: string[];
    type?: string;
    description?: string;
    class?: string;
    options?: Array<{
        name?: string;
        class?: string;
    }>;
}

export interface DesignPropertiesJSON {
    pageTemplates?: string;
    cssFiles?: string[];
    designProperties?: {
        [key: string]: JSONProperty[];
    };
}

export const createPropertyObject = (prop: JSONProperty): DropdownDesignProperty | ToggleDesignProperty | null => {
    if (!prop.name || !prop.type || !prop.description) {
        return null;
    }
    const partialProp = {
        name: prop.name,
        description: prop.description,
        oldNames: prop.oldNames || [],
    };
    const type = prop.type.toUpperCase();
    if (type === "DROPDOWN" && Array.isArray(prop.options)) {
        const options: { name: string; className: string }[] = prop.options
            .filter(pr => typeof pr.name !== "undefined" && pr.name && typeof pr.class !== "undefined" && pr.class)
            .map(pr => {
                return {
                    name: pr.name?.trim(),
                    className: pr.class?.trim(),
                };
            }) as { name: string; className: string }[];
        return new DropdownDesignProperty({
            ...partialProp,
            options,
        });
    } else if (type === "TOGGLE" && prop.class) {
        return new ToggleDesignProperty({
            ...partialProp,
            className: prop.class,
        });
    }

    return null;
};

export interface DesignPropertiesOutputJSON {
    pageTemplates?: string;
    cssFiles?: string[];
    designProperties: {
        [key: string]: Array<ToggleDesignPropertyReturn | DropdownDesignPropertyReturn>;
    };
}
