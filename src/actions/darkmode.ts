export const getMode = () => localStorage.getItem("darkMode") === "true";
export const setMode = (mode: boolean) => localStorage.setItem("darkMode", mode ? "true" : "false");
