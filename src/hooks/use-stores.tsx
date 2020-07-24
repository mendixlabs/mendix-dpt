import { useContext } from "react";
import { storesContext } from "../context/index";

export const useStores = () => useContext(storesContext);
