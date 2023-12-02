import {AuthApi, IAuthResult, LoginDataDto} from "app/api/auth-api/auth-api";
import {useMutation} from "react-query";
import {AxiosError} from "axios";
import {useAuthState} from "../../../app/store/auth/state";
import { useState } from "react";

export interface IFormikProps {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    changepassword: string;
}

export const useAuth = () => {
    const {setUser} = useAuthState();
    const [error,setError] = useState<string>(null)

    const loginMutation = useMutation<
        IAuthResult,
        AxiosError<{ message: string }>,
        LoginDataDto
    >(AuthApi.login, {
        onSuccess: async (response:IAuthResult) => {
            setUser(response.token, response.userId)
            setError(null)
        },
        onError:async (error:AxiosError<{ message: string }>) => {
            setError(error.response.data.message)
        },
    });
    return {
        loginMutation,
        error
    }

}