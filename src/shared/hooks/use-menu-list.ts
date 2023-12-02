import {ILink} from "../types/base";
import {ICON_COLLECTION} from "../components/icon/icon-list";
import { MAIN_ROUTES} from "../config/routes";

export const useMenuList = () => {

    const links: ILink[] = [
        {
            icon: ICON_COLLECTION.logo,
            ...MAIN_ROUTES.MAP,
        },
        {
            icon: ICON_COLLECTION.logo,
            ...MAIN_ROUTES.DRIVERS,
        },
        {
            icon: ICON_COLLECTION.logo,
            ...MAIN_ROUTES.LOGOUT,
        },
    ]

    return {links}
};

