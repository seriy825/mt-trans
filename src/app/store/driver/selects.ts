import { useDriverState } from "./state";

/* eslint-disable react-hooks/rules-of-hooks */
export const selectDriversIsLoading = () => useDriverState((state) => !!state.isLoading);
export const selectDrivers = () => useDriverState((state) => state.drivers);
