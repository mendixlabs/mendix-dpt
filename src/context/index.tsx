import { AppStore } from "../store/app-store";
import { createContext } from "react";
import { PropertiesStore } from "../store/properties-store";

export const storesContext = createContext({
    appStore: new AppStore(),
    propertiesStore: new PropertiesStore(),
});
