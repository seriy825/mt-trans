import { createContext, useContext } from 'react';
import {ILink} from "../types/base";

export const AppNavigationContext = createContext<{
    navigationLinks: ILink[];
}>({
    navigationLinks: [],
});

export const useAppNavigationContext = () => useContext(AppNavigationContext);