import { observable, action, computed, toJS } from "mobx";
import {
    DropdownDesignProperty,
    ToggleDesignProperty,
    DropdownDesignPropertyReturn,
    ToggleDesignPropertyReturn,
} from "./objects/design-property";

import { DesignPropertiesJSON, createPropertyObject, DesignPropertiesOutputJSON } from "./objects/json";
import autoStore from "./storage";

export type PropertiesType = "Web" | "Native" | null;

export class PropertiesStore {
    @observable hasLocalStorage = false;
    @observable type: PropertiesType = null;
    @observable properties = new Map<string, Array<DropdownDesignProperty | ToggleDesignProperty>>();
    @observable extraCrap: unknown = {};
    @observable mapsPositions = new Map<string, number>();

    constructor(json?: string) {
        autoStore(this);

        if (json) {
            this.populateFromJSON(json);
        }
    }

    @action
    setHasLocalStorage(state: boolean): void {
        this.hasLocalStorage = state;
    }

    @action
    setType(type?: PropertiesType): void {
        if (type && this.type !== type) {
            this.type = type;
        }
    }

    @action
    changeProp(oldName: string, newName: string): void {
        if (oldName && this.properties.has(oldName) && newName) {
            const props = this.properties.get(oldName) as Array<DropdownDesignProperty | ToggleDesignProperty>;
            const pos = this.mapsPositions.get(oldName) as number;
            this.properties.set(newName, props);
            this.mapsPositions.delete(oldName);
            this.mapsPositions.set(newName, pos);
            this.properties.delete(oldName);
            // this.reOrderPositions(this.locationsArray);
        }
    }

    @action
    swapPropsInCollection(key: string, from: number, to: number): void {
        if (this.properties.has(key)) {
            const listCopy = [...this.propList(key)];
            const { length } = listCopy;
            if (from >= 0 && to >= 0 && to < length && from < length) {
                listCopy.splice(to, 0, listCopy.splice(from, 1)[0]);
                this.properties.set(key, listCopy);
            }
        }
    }

    @action
    swapPropsBetweenCollections(sourceKey: string, from: number, targetKey: string, to: number): void {
        if (this.properties.has(sourceKey) && this.properties.has(targetKey)) {
            const sourceCopy = this.propList(sourceKey);
            const targetCopy = this.propList(targetKey);
            const sourceObject = sourceCopy[from];
            if (sourceObject) {
                sourceCopy.splice(from, 1);
                targetCopy.splice(to, 0, sourceObject);
                this.properties.set(sourceKey, sourceCopy);
                this.properties.set(targetKey, targetCopy);
            }
        }
    }

    @action
    addPropertyToCollection(key: string, prop: DropdownDesignProperty | ToggleDesignProperty): void {
        if (this.properties.has(key) && prop) {
            const currentList = this.propList(key);
            this.properties.set(key, [...currentList, prop]);
        }
    }

    @action
    addProp(key: string): void {
        const maxPos = this.locationsArray.reduce((max, cur) => Math.max(max, cur.pos), 0);
        this.properties.set(key, []);
        this.mapsPositions.set(key, maxPos + 10);
    }

    @action
    deleteProps(key: string): void {
        if (this.mapsPositions.has(key)) {
            this.mapsPositions.delete(key);
            this.properties.delete(key);
        }
    }

    @action
    deleteSingleProp(id: string): void {
        if (this.idMap.has(id)) {
            const key = this.idMap.get(id) as string;
            const props = this.propList(key);
            this.properties.set(
                key,
                props.filter(prop => prop.id !== id),
            );
        }
    }

    @action
    populateFromJSON(jsonStr: string): void {
        try {
            const newMap = new Map<string, Array<DropdownDesignProperty | ToggleDesignProperty>>();
            const newMapPositions = new Map<string, number>();

            const JSONObject: DesignPropertiesJSON = JSON.parse(jsonStr);

            if (JSONObject.designProperties && typeof JSONObject.designProperties === "object") {
                const props = JSONObject.designProperties;
                const keys = Object.keys(props);
                keys.forEach((key, i) => {
                    const designProperties = props[key];
                    const objectArray: Array<DropdownDesignProperty | ToggleDesignProperty> = [];
                    designProperties.forEach(designProperty => {
                        const newProp = createPropertyObject(designProperty);
                        if (newProp !== null) {
                            objectArray.push(newProp);
                        } else {
                            console.warn(`Unable to parse for ${key}: ${designProperty}`);
                        }
                    });
                    newMap.set(key, objectArray);
                    newMapPositions.set(key, (i + 1) * 10);
                });
            } else {
                this.properties = newMap;
                this.mapsPositions = newMapPositions;
                throw Error("This does not seem to be a valid Properties file!");
            }

            this.properties = newMap;
            this.mapsPositions = newMapPositions;

            const extraCrap: { pageTemplates?: string; cssFiles?: string[] } = {};

            if (typeof JSONObject.pageTemplates !== "undefined" || typeof JSONObject.cssFiles !== "undefined") {
                this.type = "Web";

                if (JSONObject.pageTemplates) {
                    extraCrap.pageTemplates = JSONObject.pageTemplates;
                }
                if (JSONObject.cssFiles) {
                    extraCrap.cssFiles = JSONObject.cssFiles;
                }
            } else {
                this.type = "Native";
            }

            this.extraCrap = extraCrap;
        } catch (error) {
            console.error(error);
        }
    }

    @action
    changeLocations(source: number, destination: number): void {
        if (source === destination) {
            return;
        }
        const modifier = source < destination ? 1 : 0;
        const transformed = [...this.locationsArray];
        const found = transformed.findIndex(t => t.pos === (source + 1) * 10);
        if (found !== -1) {
            transformed[found].pos = (destination + modifier) * 10 + 5;
            this.reOrderPositions(transformed);
        }
    }

    @action
    reOrderPositions(oldPositions: Array<{ key: string; pos: number }>): void {
        const newOrder = [...oldPositions.sort((a, b) => a.pos - b.pos)];
        const newPositionMap = new Map<string, number>();
        newOrder.forEach((keyVal, index) => {
            newPositionMap.set(keyVal.key, (index + 1) * 10);
        });
        this.mapsPositions = newPositionMap;
    }

    @computed
    get locationsArray(): Array<{ key: string; pos: number }> {
        return Array.from(this.mapsPositions)
            .map(arr => ({ key: arr[0], pos: arr[1] }))
            .sort((a, b) => a.pos - b.pos);
    }

    @computed
    get keys(): string[] {
        return Array.from(this.properties.keys());
    }

    @computed
    get propertyList() {
        return this.locationsArray.map(loc => {
            const properties = this.properties.get(loc.key) as Array<DropdownDesignProperty | ToggleDesignProperty>;
            return {
                name: loc.key,
                position: loc.pos as number,
                properties,
            };
        });
    }

    @computed
    get JSOBject(): DesignPropertiesOutputJSON {
        let extraProps: Partial<DesignPropertiesJSON> = {};
        if (this.type === "Web") {
            const extra = toJS(this.extraCrap);
            extraProps = Object.assign(extraProps, extra);
        }
        const jsonObject: DesignPropertiesOutputJSON = Object.assign(extraProps, {
            designProperties: {},
        }) as DesignPropertiesOutputJSON;
        this.propertyList.forEach(prop => {
            const properties = prop.properties.map(prop => prop.jsObject).filter(prop => prop !== null) as Array<
                DropdownDesignPropertyReturn | ToggleDesignPropertyReturn
            >;
            if (properties.length > 0) {
                jsonObject.designProperties[prop.name] = properties;
            }
        });

        return toJS(jsonObject);
    }

    @computed
    get isEmpty() {
        return this.properties.size === 0;
    }

    @computed
    get classList() {
        return this.propertyList
            .map(el =>
                el.properties.map(prop => {
                    return prop instanceof DropdownDesignProperty
                        ? prop.options.map(opt => opt.className)
                        : [prop.className];
                }),
            )
            .flat(2);
    }

    private propList(key: string, copy = true) {
        const list = this.properties.get(key) as Array<DropdownDesignProperty | ToggleDesignProperty>;
        return copy ? [...list] : list;
    }

    private get idMap(): Map<string, string> {
        const returnMap = new Map<string, string>();
        this.propertyList.forEach(prop => {
            prop.properties.forEach(singleProp => {
                returnMap.set(singleProp.id, prop.name);
            });
        });
        return returnMap;
    }

    public propNames(key: string) {
        if (this.properties.has(key)) {
            return this.propList(key).map(prop => prop.name);
        }
        return [];
    }
}
