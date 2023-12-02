import { AuthGuard } from "app/guards/auth-guard";
import { MainLayout } from "layouts/main-layouts";
import { AuthPage } from "modules/auth/AuthPage";
import { Logout } from "modules/auth/pages/login/logout/Logout";
import { DriversPage } from "modules/main/drivers/DriversPage";
import { MapPage } from "modules/main/map/MapPage";
import { FC } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { AUTH_ROUTES, MAIN_ROUTES } from "shared/config/routes";

export const AppRoutes:FC = () => {
    return useRoutes([
        {
            path: '/',
            element: <AuthGuard><MainLayout/></AuthGuard>,
            children:[
                {
                    path:MAIN_ROUTES.MAP.path,
                    element:<MapPage/>
                },
                {
                    path:MAIN_ROUTES.DRIVERS.path,
                    element:<DriversPage/>
                },
                {
                    path:MAIN_ROUTES.LOGOUT.path,
                    element:<></>
                }
            ]
        },
        {
            path: '/logout',
            element: <Logout/>,            
        },
        ...AuthPage,
        {path: '*', element: <Navigate to={AUTH_ROUTES.ROOT.path}/>},

    ]);
}