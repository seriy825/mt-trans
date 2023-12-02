/* eslint-disable react-hooks/rules-of-hooks */
import { useAuthState } from 'app/store/auth/state';
export const selectIsLoggedIn = () => useAuthState((state) => !!state.userId);
export const selectAuthUserData = () => useAuthState((state) => state.userId);
