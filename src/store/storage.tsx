import { autorun } from "mobx";
import storage from "store";
import { PropertiesStore } from "./properties-store";

export const STORAGE_KEY = "__MX_DESIGN_PROPERTIES_TOOLKIT_SAVE";

const autoStore = (store: PropertiesStore) => {
    let firstRun = true;

    autorun(() => {
        if (firstRun) {
            const existing = storage.get(STORAGE_KEY);

            if (existing) {
                store.setHasLocalStorage(true);
                store.populateFromJSON(JSON.stringify(existing));
            }
        }

        storage.set(STORAGE_KEY, store.JSOBject);
    });

    firstRun = false;
};

export default autoStore;
