import { observable, action } from "mobx";
import { getMode } from "actions/darkmode";
import { setMode } from "../actions/darkmode";

export class AppStore {
    @observable
    darkMode = getMode();

    @action
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        setMode(this.darkMode);
    }
}
