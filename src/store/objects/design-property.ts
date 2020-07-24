import { observable, action, computed } from "mobx";
import { v4 as uuidv4 } from "uuid";

// TYPES

export type DesignPropertyType = "Toggle" | "Dropdown";

// ABSTRACT

export interface AbstractDesignProperty {
    id: string;
    name: string;
    description: string;
    oldNames: string[];
    type: DesignPropertyType;
}

interface AbstractDesignConstructorProps {
    name: string;
    description: string;
    oldNames?: string[];
}

export interface AbstractDesignPropertyReturn {
    name: string;
    description: string;
    type: DesignPropertyType;
    oldNames?: string[];
}

export class AbstractDesignProperty {
    id: string = uuidv4();

    @observable name = "";
    @observable description = "";
    @observable oldNames: string[] = [];

    constructor({ name, description, oldNames = [] }: AbstractDesignConstructorProps) {
        this.name = name;
        this.description = description;
        this.oldNames = oldNames;
    }

    @action
    setName(name: string): void {
        this.name = name;
    }

    @action
    setDescription(description: string): void {
        this.description = description;
    }

    @action
    setOldNames(names: string[]): void {
        this.oldNames = names;
    }

    @computed
    get jsAbstract(): AbstractDesignPropertyReturn {
        const ret: AbstractDesignPropertyReturn = {
            name: this.name,
            description: this.description,
            type: this.type,
        };
        if (this.oldNames.length > 0) {
            ret.oldNames = this.oldNames;
        }
        return ret;
    }
}

// Toggle

interface ToggleDesignConstructorProps extends AbstractDesignConstructorProps {
    className: string;
}

export interface ToggleDesignPropertyReturn extends AbstractDesignPropertyReturn {
    class: string;
}

export class ToggleDesignProperty extends AbstractDesignProperty {
    type: DesignPropertyType = "Toggle";

    @observable className = "";

    constructor({ name, description, className }: ToggleDesignConstructorProps) {
        super({ name, description });
        this.className = className;
    }

    @action
    setClassName(className: string) {
        this.className = className;
    }

    @computed
    get ignored(): boolean {
        return this.className === "";
    }

    @computed
    get jsObject(): ToggleDesignPropertyReturn | null {
        if (this.ignored) {
            return null;
        }
        return {
            ...this.jsAbstract,
            class: this.className,
        };
    }
}

// DropDown

export interface DropdownDesignPropertyProperty {
    // This is added because the table set this when doing action. Dirty, but it works
    tableData: {
        id: string;
    };
}

export class DropdownDesignPropertyProperty {
    id: string = uuidv4();

    @observable name = "";
    @observable className = "";

    constructor(name: string, className: string) {
        this.name = name;
        this.className = className;
    }

    @action
    setName(name: string): void {
        this.name = name;
    }

    @action
    setClassName(className: string) {
        this.className = className;
    }

    @computed
    get jsObject() {
        return {
            name: this.name,
            class: this.className,
        };
    }
}

interface DropdownDesignConstructorProps extends AbstractDesignConstructorProps {
    options: Array<{
        name: string;
        className: string;
    }>;
}

export interface DropdownDesignPropertyOption {
    name: string;
    class: string;
}

export interface DropdownDesignPropertyReturn extends AbstractDesignPropertyReturn {
    options: Array<DropdownDesignPropertyOption>;
}

export class DropdownDesignProperty extends AbstractDesignProperty {
    type: DesignPropertyType = "Dropdown";

    @observable
    options: DropdownDesignPropertyProperty[] = [];

    constructor({ name, description, options }: DropdownDesignConstructorProps) {
        super({ name, description });
        this.options = options.map(opt => new DropdownDesignPropertyProperty(opt.name, opt.className));
    }

    @action
    addOption(name: string, className: string): void {
        const opts = [...this.options];
        opts.push(new DropdownDesignPropertyProperty(name, className));
        this.options = opts;
    }

    @action
    removeOption(id: string): void {
        const filtered = [...this.options.filter(opt => opt.id !== id)];
        this.options = filtered;
    }

    @action
    moveOption(from: number, to: number): void {
        const listCopy = [...this.options];
        const { length } = listCopy;
        if (from >= 0 && to >= 0 && to < length && from < length) {
            listCopy.splice(to, 0, listCopy.splice(from, 1)[0]);
            this.options = listCopy;
        }
    }

    @computed
    get ignored(): boolean {
        return this.options.filter(opt => opt.name && opt.className).length === 0;
    }

    @computed
    get jsObject(): DropdownDesignPropertyReturn | null {
        if (this.ignored) {
            return null;
        }
        const options = this.options.filter(opt => opt.name && opt.className).map(opt => opt.jsObject);
        return {
            ...this.jsAbstract,
            options,
        };
    }
}
