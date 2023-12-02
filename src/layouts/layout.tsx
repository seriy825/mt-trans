import React from 'react';
import {useMenuList} from "./../shared/hooks/use-menu-list";
import {Loader} from "./../shared/components/loader/loader";
import {AppNavigationContext} from 'shared/context/app-navigation-context'
import './../assets/sass/style.scss'
interface LayoutProps {
    isUserAuth: boolean;
    isLoading?: boolean;
}

export const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
                                                                           isUserAuth,                                           
                                                                           isLoading,
                                                                           children,
                                                                       }) => {

    const {links} = useMenuList()

    if (!isUserAuth) {
        return (<>{children}</>)
    }
    if (isLoading) {
        return (<Loader mode='blur'/>);
    }

    return (
        <AppNavigationContext.Provider value={{navigationLinks: links}}>
            {children}
        </AppNavigationContext.Provider>
    );
};

