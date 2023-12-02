import {BaseHttpServices} from "shared/services/base-http-services";
import {AxiosError, AxiosResponse} from "axios";

export interface LoginDataDto {
    email: string;
    password: string;
}

export interface IAuthResult {
    token: string,
    userId:number
}

export class AuthApiService {
    private readonly http: BaseHttpServices;

    constructor(httpService: BaseHttpServices) {
        this.http = httpService;
    }

    login = async (data: LoginDataDto): Promise<IAuthResult> => {
        const payload = await this.http.post<
            AxiosError<{ error: string; status: number }>,
            AxiosResponse<IAuthResult>
        >(`/auth/login`, data);
        return payload.data;
    };
}

export const AuthApi = new AuthApiService(new BaseHttpServices());