/* eslint-disable react-hooks/rules-of-hooks */
import { useDriverState } from "./state";
export const selectDriversIsLoading = () => useDriverState((state) => !!state.isLoading);
export const selectDrivers = () => useDriverState((state) => state.drivers);
