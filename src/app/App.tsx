import React, { useEffect } from 'react';
import { Layout } from 'layouts/layout';
import {ToastContainer, toast} from "react-toastify";
import { AppRoutes } from './routing/app-routes';
import { AuthGuard } from './guards/auth-guard';
import { selectAuthUserData } from './store/auth/selects';
import { useLocation, useNavigate } from 'react-router-dom';
import { MAIN_ROUTES } from 'shared/config/routes';
import { useDriverState } from './store/driver/state';
import { selectDrivers, selectDriversIsLoading } from './store/driver/selects';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from 'shared/config/variables';
import { LocalStorageService } from 'shared/services/local-storage-service';
import { IDriver } from 'shared/types/api-types/driver';
import { CustomToast } from 'modules/main/map/components/customToast';

export const App = () => {
  const navigate = useNavigate()
  const userAuth = selectAuthUserData()
  const isDriversLoading = selectDriversIsLoading()
  const {getDrivers, updateDriver} = useDriverState()
  const drivers = selectDrivers()
  const location =  useLocation()
  useEffect(()=>{
    if (userAuth) {
      if (!location.pathname || location.pathname==='/') navigate(MAIN_ROUTES.MAP.path)
      getDrivers()
    }
  },[userAuth])
  useEffect(() => {
    if (userAuth){
      const socket = io(SOCKET_BASE_URL,{
        transports:['websocket'],
        auth: {
          authorization: LocalStorageService.get('token') || null
        },      
      });
      if (drivers){
        socket.on('driverUpdated', (updatedDriver:IDriver) => {
          const driver = drivers.find(driver=>driver.id===updatedDriver.id)  
          if (driver){
            if (driver.active && !updatedDriver.active) toast.error(CustomToast({text:'VEHICLE OFF!', driver:updatedDriver}))
            if (!driver.active && updatedDriver.active) toast.success(CustomToast({text:'VEHICLE ON!', driver:updatedDriver}))
            updateDriver(updatedDriver)                
          }
        });
        return () => {
          socket.disconnect();
        };
      }
    }
    }, [drivers, userAuth])
  return (
    <AuthGuard>
      <Layout isUserAuth={!!userAuth} isLoading={isDriversLoading}>      
        <AppRoutes/>                                    
        <ToastContainer
            limit={3}
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
      </Layout>
    </AuthGuard>
  );
}