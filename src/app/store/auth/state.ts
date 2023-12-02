import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {LocalStorageService} from 'shared/services/local-storage-service';

interface IAuthState {
    userId: number | null;
    setUser: (token: string | null, user: number | null) => void;
}

export const useAuthState = create<IAuthState>()(
    devtools(
        (set) => ({
            userId: null,

            setUser(token, userId) {
                if (!token) {
                    LocalStorageService.remove('token');
                    LocalStorageService.remove('userId');
                    set({userId: null});
                    return;
                }
                LocalStorageService.set('token', token);
                LocalStorageService.set('userId', userId);
                set({userId: userId});
            },
        }),
        {name: 'useAuthState', store: 'useAuthState'},
    ),
);